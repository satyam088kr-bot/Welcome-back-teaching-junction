import React, { useRef, useState } from 'react';
import {
  AlertCircle,
  CheckCircle,
  CloudUpload,
  Eye,
  FileCode,
  FileSpreadsheet,
  FileText,
  FileUp,
  Image as ImageIcon,
  Lock,
  Presentation,
  RefreshCw,
  Sparkles,
  Upload,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ALL_CLASSES, ALL_SUBJECTS } from '../../data/mockData';
import {
  detectFileFormat,
  formatFileSize,
  uploadMaterialFile,
} from '../../firebase/materialsService';
import { ClassCategory, FileFormat, MaterialType, StudyMaterial, SubjectCategory } from '../../types';

interface Props {
  onSuccess?: () => void;
  onViewNote?: (material: StudyMaterial) => void;
}

export const UploadNotesTab: React.FC<Props> = ({ onSuccess, onViewNote }) => {
  const { addMaterial, addToast } = useApp();

  // Form Fields
  const [selectedClass, setSelectedClass] = useState<ClassCategory>('Class 10th');
  const [selectedSubject, setSelectedSubject] = useState<SubjectCategory>('Science');
  const [chapterName, setChapterName] = useState('');
  const [notesTitle, setNotesTitle] = useState('');
  const [description, setDescription] = useState('');
  const [materialType, setMaterialType] = useState<MaterialType>('handwritten_notes');
  const [uploadDate, setUploadDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [pageCount, setPageCount] = useState<number>(10);
  const [isProtected, setIsProtected] = useState<boolean>(true);
  const [contentSummary, setContentSummary] = useState('');

  // File Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Upload Progress & Status
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatusText, setUploadStatusText] = useState('');
  const [bytesInfo, setBytesInfo] = useState('');
  const [lastUploadedNote, setLastUploadedNote] = useState<StudyMaterial | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const detectedFormat: FileFormat = selectedFile
    ? detectFileFormat(selectedFile.name, selectedFile.type)
    : 'pdf';

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setUploadError(null);

    // Auto-fill title if empty
    if (!notesTitle.trim()) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setNotesTitle(cleanName);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setUploadError('Please select a file to upload (PDF, Word, Excel, PPT, Image, or Text).');
      return;
    }
    if (!notesTitle.trim()) {
      setUploadError('Please provide a title for the study notes.');
      return;
    }
    if (!chapterName.trim()) {
      setUploadError('Please enter the chapter name.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(5);
    setUploadStatusText('Connecting to Firebase Cloud Storage...');
    setUploadError(null);

    try {
      // 1. Upload to Firebase Cloud Storage with live progress
      const uploadResult = await uploadMaterialFile(
        selectedFile,
        (progress, bytesTransferred, totalBytes) => {
          setUploadProgress(progress);
          setBytesInfo(`${formatFileSize(bytesTransferred)} / ${formatFileSize(totalBytes)}`);
          if (progress < 40) {
            setUploadStatusText('Uploading binary data to Firebase Storage...');
          } else if (progress < 90) {
            setUploadStatusText('Securing cloud bucket assets and generating token...');
          } else {
            setUploadStatusText('Finalizing download URL and verifying checksum...');
          }
        }
      );

      setUploadStatusText('Saving document metadata to Cloud Firestore...');

      // 2. Prepare Study Material Record
      const newMaterial: Omit<StudyMaterial, 'id' | 'createdAt' | 'downloadCount'> = {
        title: notesTitle.trim(),
        description:
          description.trim() ||
          `Official curriculum notes for ${selectedClass} - ${selectedSubject} (${chapterName.trim()})`,
        classCategory: selectedClass,
        subject: selectedSubject,
        chapterName: chapterName.trim(),
        fileUrl: uploadResult.fileUrl,
        fileName: uploadResult.fileName,
        fileFormat: uploadResult.fileFormat,
        fileSize: uploadResult.fileSize,
        fileSizeBytes: uploadResult.fileSizeBytes,
        storagePath: uploadResult.storagePath,
        pageCount: Number(pageCount) || 12,
        type: materialType,
        isProtected,
        uploadDate,
        contentPreview:
          contentSummary.trim() ||
          `TEACHING JUNCTION COACHING - ${notesTitle.trim()}\nClass: ${selectedClass} | Subject: ${selectedSubject}\nChapter: ${chapterName.trim()}\nFormat: ${uploadResult.fileFormat.toUpperCase()} (${uploadResult.fileSize})\nUpload Date: ${uploadDate}\n\nKey Concepts, Theorems, and Board Preparation Materials verified by Academic Director Er. Satyam Kumar.`,
      };

      // 3. Add to Application state and Cloud Firestore
      addMaterial(newMaterial);

      const created: StudyMaterial = {
        ...newMaterial,
        id: 'mat-' + Date.now(),
        downloadCount: 0,
        createdAt: new Date().toISOString(),
      };

      setLastUploadedNote(created);
      setIsUploading(false);
      setUploadProgress(100);
      setUploadStatusText('Published successfully to student dashboards!');

      // Reset form fields for next upload
      setSelectedFile(null);
      setNotesTitle('');
      setChapterName('');
      setDescription('');
      setContentSummary('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      addToast({
        type: 'success',
        title: 'Notes Uploaded Successfully',
        message: 'The file has been stored in Firebase Cloud Storage and is accessible to approved students.',
      });
    } catch (err) {
      console.error('Notes upload failed:', err);
      setIsUploading(false);
      setUploadError('Failed to upload file. Please check your network connection and try again.');
      addToast({
        type: 'error',
        title: 'Upload Failed',
        message: 'Could not complete file upload to cloud storage.',
      });
    }
  };

  const getFormatBadge = (fmt: FileFormat) => {
    switch (fmt) {
      case 'pdf':
        return <span className="bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded text-[10px]">PDF DOCUMENT</span>;
      case 'doc':
      case 'docx':
        return <span className="bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded text-[10px]">WORD DOCUMENT</span>;
      case 'xls':
      case 'xlsx':
        return <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">EXCEL SPREADSHEET</span>;
      case 'ppt':
      case 'pptx':
        return <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded text-[10px]">POWERPOINT SLIDES</span>;
      case 'jpg':
      case 'jpeg':
      case 'png':
        return <span className="bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded text-[10px]">IMAGE (JPG/PNG)</span>;
      default:
        return <span className="bg-slate-100 text-slate-800 font-bold px-2 py-0.5 rounded text-[10px]">TEXT / DOCUMENT</span>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-7 text-white shadow-lg flex items-center justify-between gap-4 flex-wrap">
        <div className="space-y-1 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30">
            <CloudUpload className="w-3.5 h-3.5" />
            <span>Permanent Firebase Cloud Storage & Firestore Sync</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">Upload Coaching Notes & Study Materials</h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Upload PDF notes, Word documents, Excel sheets, PowerPoint presentations, diagrams, and model answer papers. Uploaded files persist permanently in cloud storage and synchronize instantly with approved student devices.
          </p>
        </div>
      </div>

      {/* Success Banner if uploaded */}
      {lastUploadedNote && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-sm text-emerald-950">Notes Uploaded & Published Live!</h4>
                <span className="text-[10px] bg-emerald-200 text-emerald-900 font-black px-2 py-0.5 rounded-full">
                  ACTIVE
                </span>
              </div>
              <p className="text-xs text-emerald-800 mt-0.5">
                <strong>{lastUploadedNote.title}</strong> is now live for approved students of{' '}
                <strong>{lastUploadedNote.classCategory}</strong> ({lastUploadedNote.subject}).
              </p>
              <div className="flex items-center gap-3 mt-1.5 text-[11px] text-emerald-700">
                <span>Format: {lastUploadedNote.fileFormat?.toUpperCase()}</span>
                <span>•</span>
                <span>Size: {lastUploadedNote.fileSize}</span>
                <span>•</span>
                <span>Chapter: {lastUploadedNote.chapterName}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            {onViewNote && (
              <button
                type="button"
                onClick={() => onViewNote(lastUploadedNote)}
                className="flex-1 sm:flex-none px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview Document</span>
              </button>
            )}
            {onSuccess && (
              <button
                type="button"
                onClick={onSuccess}
                className="flex-1 sm:flex-none px-4 py-2 bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-xl text-xs font-bold transition"
              >
                View in Manage Notes
              </button>
            )}
            <button
              type="button"
              onClick={() => setLastUploadedNote(null)}
              className="p-2 text-emerald-700 hover:text-emerald-950 rounded-lg"
              title="Dismiss banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Upload Form Container */}
      <form onSubmit={handleUploadSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Drag & Drop File Picker */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileUp className="w-4 h-4 text-blue-600" />
                <span>Select Educational File</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Supported formats: PDF, DOC/DOCX, XLS/XLSX, PPT/PPTX, JPG/PNG, TXT.
              </p>
            </div>

            {/* Drag & Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-3 ${
                isDragging
                  ? 'border-blue-600 bg-blue-50/70 scale-[1.01]'
                  : selectedFile
                  ? 'border-emerald-400 bg-emerald-50/40'
                  : 'border-slate-300 hover:border-blue-400 bg-slate-50 hover:bg-blue-50/30'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.txt"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileSelect(e.target.files[0]);
                  }
                }}
              />

              {selectedFile ? (
                <div className="space-y-2 max-w-full">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-xs truncate max-w-[280px] mx-auto">
                      {selectedFile.name}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {formatFileSize(selectedFile.size)} • {detectedFormat.toUpperCase()}
                    </div>
                  </div>
                  <div className="pt-2">{getFormatBadge(detectedFormat)}</div>
                  <div className="text-[11px] text-blue-600 font-semibold hover:underline pt-1">
                    Click or drag another file to replace
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mx-auto">
                    <Upload className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-800">
                      Drag & Drop study file here
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      or click to browse from your device
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap justify-center text-[10px] text-slate-400 pt-2">
                    <span className="px-2 py-0.5 rounded bg-white border border-slate-200 font-bold">PDF</span>
                    <span className="px-2 py-0.5 rounded bg-white border border-slate-200 font-bold">DOC / DOCX</span>
                    <span className="px-2 py-0.5 rounded bg-white border border-slate-200 font-bold">XLS / XLSX</span>
                    <span className="px-2 py-0.5 rounded bg-white border border-slate-200 font-bold">PPT / PPTX</span>
                    <span className="px-2 py-0.5 rounded bg-white border border-slate-200 font-bold">JPG / PNG</span>
                  </div>
                </>
              )}
            </div>

            {/* Error Message */}
            {uploadError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2 text-xs text-red-800">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{uploadError}</span>
              </div>
            )}

            {/* Upload Progress Bar */}
            {isUploading && (
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-blue-900">{uploadStatusText}</span>
                  <span className="font-mono font-bold text-blue-700">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-blue-200/80 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                {bytesInfo && (
                  <div className="text-[11px] text-blue-600 font-mono text-right">{bytesInfo}</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Metadata Fields */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
            Study Material Metadata & Categorization
          </h3>

          {/* Notes Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Notes Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Chapter 4 Carbon and Its Compounds - Complete Handwritten Revision Guide"
              value={notesTitle}
              onChange={(e) => setNotesTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
            />
          </div>

          {/* Class & Subject */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Target Class Category <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value as ClassCategory)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 font-semibold"
              >
                {ALL_CLASSES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Subject Category <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value as SubjectCategory)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 font-semibold"
              >
                {ALL_SUBJECTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Chapter Name & Material Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Chapter Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Chapter 4: Carbon and Its Compounds"
                value={chapterName}
                onChange={(e) => setChapterName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Material Classification
              </label>
              <select
                value={materialType}
                onChange={(e) => setMaterialType(e.target.value as MaterialType)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="handwritten_notes">Handwritten Notes (Teacher Summary)</option>
                <option value="formula_sheet">Formula Sheet & Key Formulas</option>
                <option value="ncert_solution">NCERT In-text & Exercise Solutions</option>
                <option value="pyq_paper">Previous Years Solved Question Paper</option>
                <option value="sample_paper">Sample Paper / Mock Examination</option>
              </select>
            </div>
          </div>

          {/* Upload Date, Pages & Access Protection */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Upload Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={uploadDate}
                onChange={(e) => setUploadDate(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Estimated Pages / Slides
              </label>
              <input
                type="number"
                min="1"
                max="500"
                value={pageCount}
                onChange={(e) => setPageCount(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Access Protection
              </label>
              <select
                value={isProtected ? 'true' : 'false'}
                onChange={(e) => setIsProtected(e.target.value === 'true')}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 font-semibold"
              >
                <option value="true">Approved Students Only</option>
                <option value="false">Public Free Access</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Short Description / Overview
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Includes full covalent bond mechanism, allotropes of carbon, IUPAC nomenclature rules, and board PYQs."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Content Summary / Preview Text */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
              <span>Built-in Reader Content Preview (Optional)</span>
              <span className="text-[10px] text-slate-400 font-normal">Shows in web reader</span>
            </label>
            <textarea
              rows={3}
              placeholder="Add key summary points or paste text that students can read directly in their browser..."
              value={contentSummary}
              onChange={(e) => setContentSummary(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Lock className="w-3.5 h-3.5 text-amber-600" />
              <span>
                {isProtected
                  ? 'Access restricted to approved students only'
                  : 'Open to all visitors'}
              </span>
            </div>

            <button
              type="submit"
              disabled={isUploading || !selectedFile}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2"
            >
              {isUploading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Uploading to Cloud...</span>
                </>
              ) : (
                <>
                  <CloudUpload className="w-4 h-4" />
                  <span>Upload & Publish to Students</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
