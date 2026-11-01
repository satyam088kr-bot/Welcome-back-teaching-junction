import React, { useRef, useState } from 'react';
import {
  AlertCircle,
  CheckCircle,
  CloudUpload,
  FileText,
  Lock,
  RefreshCw,
  Upload,
  X,
} from 'lucide-react';
import { ALL_CLASSES, ALL_SUBJECTS } from '../../data/mockData';
import {
  detectFileFormat,
  formatFileSize,
  uploadMaterialFile,
} from '../../firebase/materialsService';
import { ClassCategory, FileFormat, MaterialType, StudyMaterial, SubjectCategory } from '../../types';

interface Props {
  material: StudyMaterial;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: Partial<StudyMaterial>) => void;
}

export const EditNoteModal: React.FC<Props> = ({ material, isOpen, onClose, onSave }) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState(material.title);
  const [selectedClass, setSelectedClass] = useState<ClassCategory>(material.classCategory);
  const [selectedSubject, setSelectedSubject] = useState<SubjectCategory>(material.subject);
  const [chapterName, setChapterName] = useState(material.chapterName);
  const [description, setDescription] = useState(material.description);
  const [materialType, setMaterialType] = useState<MaterialType>(material.type);
  const [pageCount, setPageCount] = useState<number>(material.pageCount);
  const [isProtected, setIsProtected] = useState<boolean>(material.isProtected);
  const [uploadDate, setUploadDate] = useState<string>(
    material.uploadDate || material.createdAt.split('T')[0]
  );
  const [contentPreview, setContentPreview] = useState(material.contentPreview || '');

  // Replace file state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [replacementFile, setReplacementFile] = useState<File | null>(null);
  const [isUploadingReplacement, setIsUploadingReplacement] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !chapterName.trim()) {
      setErrorMsg('Title and chapter name are required.');
      return;
    }

    try {
      let fileUpdates: Partial<StudyMaterial> = {};

      if (replacementFile) {
        setIsUploadingReplacement(true);
        setUploadProgress(10);

        const uploadRes = await uploadMaterialFile(replacementFile, (p) => {
          setUploadProgress(p);
        });

        fileUpdates = {
          fileUrl: uploadRes.fileUrl,
          fileName: uploadRes.fileName,
          fileFormat: uploadRes.fileFormat,
          fileSize: uploadRes.fileSize,
          fileSizeBytes: uploadRes.fileSizeBytes,
          storagePath: uploadRes.storagePath,
        };
      }

      onSave({
        title: title.trim(),
        chapterName: chapterName.trim(),
        classCategory: selectedClass,
        subject: selectedSubject,
        description: description.trim(),
        type: materialType,
        pageCount: Number(pageCount) || 10,
        isProtected,
        uploadDate,
        contentPreview: contentPreview.trim(),
        ...fileUpdates,
      });

      setIsUploadingReplacement(false);
      onClose();
    } catch (err) {
      console.error('Update note failed:', err);
      setIsUploadingReplacement(false);
      setErrorMsg('Failed to upload replacement file. Please retry.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 my-auto animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Edit Note & Replace File</h3>
              <p className="text-[11px] text-slate-400">Update metadata or replace cloud storage file</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 text-xs max-h-[80vh] overflow-y-auto">
          {errorMsg && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Notes Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
            />
          </div>

          {/* Class & Subject */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Class</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value as ClassCategory)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white focus:outline-none font-semibold"
              >
                {ALL_CLASSES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Subject</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value as SubjectCategory)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white focus:outline-none font-semibold"
              >
                {ALL_SUBJECTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Chapter & Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Chapter Name</label>
              <input
                type="text"
                required
                value={chapterName}
                onChange={(e) => setChapterName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Classification</label>
              <select
                value={materialType}
                onChange={(e) => setMaterialType(e.target.value as MaterialType)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white focus:outline-none"
              >
                <option value="handwritten_notes">Handwritten Notes</option>
                <option value="formula_sheet">Formula Sheet</option>
                <option value="ncert_solution">NCERT Solution</option>
                <option value="pyq_paper">PYQ Solved Paper</option>
                <option value="sample_paper">Sample Paper</option>
              </select>
            </div>
          </div>

          {/* Upload Date & Pages & Protection */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Upload Date</label>
              <input
                type="date"
                value={uploadDate}
                onChange={(e) => setUploadDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Estimated Pages</label>
              <input
                type="number"
                min="1"
                max="500"
                value={pageCount}
                onChange={(e) => setPageCount(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Access Protection</label>
              <select
                value={isProtected ? 'true' : 'false'}
                onChange={(e) => setIsProtected(e.target.value === 'true')}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white focus:outline-none"
              >
                <option value="true">Approved Students Only</option>
                <option value="false">Public Demo</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none"
            />
          </div>

          {/* Replace File Section */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">Replace Cloud File (Optional)</span>
                <span className="text-[11px] text-slate-500">
                  Current file: {material.fileName || material.title} ({material.fileSize})
                </span>
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold rounded-lg transition"
              >
                Choose New File
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.txt"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setReplacementFile(e.target.files[0]);
                }
              }}
            />

            {replacementFile && (
              <div className="bg-white border border-blue-200 rounded-xl p-3 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-800">{replacementFile.name}</div>
                  <div className="text-[11px] text-slate-400">
                    {formatFileSize(replacementFile.size)} • New file ready to upload
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setReplacementFile(null)}
                  className="text-slate-400 hover:text-red-600 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {isUploadingReplacement && (
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-blue-700 font-bold">
                  <span>Uploading to Firebase Cloud Storage...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-200"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isUploadingReplacement}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 font-semibold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploadingReplacement}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold rounded-xl shadow transition flex items-center gap-2"
            >
              {isUploadingReplacement ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Saving to Cloud...</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
