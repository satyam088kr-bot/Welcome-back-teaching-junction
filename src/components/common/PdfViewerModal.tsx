import React, { useState } from 'react';
import {
  Download,
  FileText,
  Lock,
  Maximize2,
  Minimize2,
  Printer,
  ShieldAlert,
  X,
  ZoomIn,
  ZoomOut,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Sparkles,
  ExternalLink,
  FileSpreadsheet,
  Presentation,
  FileCode,
  Image as ImageIcon,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StudyMaterial } from '../../types';

interface Props {
  material: StudyMaterial;
  onClose: () => void;
}

export const PdfViewerModal: React.FC<Props> = ({ material, onClose }) => {
  const { currentUser, incrementDownload, addToast, setAuthModalOpen } = useApp();
  const [zoom, setZoom] = useState<number>(100);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [embedViewMode, setEmbedViewMode] = useState<'reader' | 'embed'>('reader');

  // Protection logic:
  const isApproved = currentUser?.role === 'admin' || currentUser?.status === 'approved';
  const isPending = currentUser && currentUser.status === 'pending';
  const isBlocked = material.isProtected && !isApproved;

  const fileFormat =
    material.fileFormat ||
    (material.fileName?.split('.').pop()?.toLowerCase() as any) ||
    'pdf';

  const isOfficeFile = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(fileFormat);
  const isImageFile = ['jpg', 'jpeg', 'png'].includes(fileFormat);
  const isPdf = fileFormat === 'pdf';
  const isRealCloudUrl =
    material.fileUrl &&
    (material.fileUrl.startsWith('http://') ||
      material.fileUrl.startsWith('https://') ||
      material.fileUrl.startsWith('data:'));

  const handleDownload = () => {
    if (isBlocked) {
      addToast({
        type: 'warning',
        title: 'Access Restricted',
        message: 'Only approved students can download protected notes.',
      });
      return;
    }

    incrementDownload(material.id);

    // If it's a real uploaded cloud file, download it directly
    if (isRealCloudUrl && !material.fileUrl.startsWith('/mock/')) {
      const link = document.createElement('a');
      link.href = material.fileUrl;
      link.download = material.fileName || `${material.title}.${fileFormat}`;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      addToast({
        type: 'success',
        title: 'Download Started',
        message: `${material.fileName || material.title} is downloading.`,
      });
      return;
    }

    // Fallback: Create formatted study document
    const fileContent = `========================================================
TEACHING JUNCTION COACHING - STUDY MATERIAL
Director: Er. Satyam Kumar
Contact: satyam088kr@gmail.com | +91 9876543210
========================================================
TITLE: ${material.title}
CLASS: ${material.classCategory} | SUBJECT: ${material.subject}
CHAPTER: ${material.chapterName}
PAGES: ${material.pageCount} | FILE SIZE: ${material.fileSize}
AUTHORIZED TO: ${currentUser?.name || 'Approved Student'} (${currentUser?.email || 'Registered'})
DATE GENERATED: ${new Date().toLocaleDateString()}
========================================================

${material.contentPreview || 'Full study notes content verified for academic curriculum.'}

========================================================
© 2026 Teaching Junction Coaching. All rights reserved.
Unauthorized reproduction or sharing is prohibited.
========================================================`;

    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${material.title.replace(/[^a-zA-Z0-9_-]/g, '_')}_TeachingJunction.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    addToast({
      type: 'success',
      title: 'Download Started',
      message: `${material.title} downloaded successfully.`,
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const getFormatIcon = () => {
    if (isOfficeFile) {
      if (fileFormat.startsWith('xl')) return <FileSpreadsheet className="w-4 h-4 text-emerald-400" />;
      if (fileFormat.startsWith('pp')) return <Presentation className="w-4 h-4 text-amber-400" />;
      return <FileText className="w-4 h-4 text-blue-400" />;
    }
    if (isImageFile) return <ImageIcon className="w-4 h-4 text-purple-400" />;
    if (fileFormat === 'txt') return <FileCode className="w-4 h-4 text-slate-400" />;
    return <FileText className="w-4 h-4 text-white" />;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-2 sm:p-4 animate-in fade-in duration-200">
      <div
        className={`w-full ${
          isFullscreen ? 'h-full max-w-full' : 'max-w-4xl max-h-[92vh]'
        } flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200`}
      >
        {/* Top Viewer Toolbar */}
        <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between border-b border-slate-800 gap-2 flex-wrap">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
              {getFormatIcon()}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-xs sm:text-sm font-bold text-white truncate max-w-[200px] sm:max-w-md">
                  {material.title}
                </h2>
                <span className="uppercase text-[9px] font-black px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  {fileFormat}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-2">
                <span className="text-blue-400 font-medium">{material.classCategory}</span>
                <span>•</span>
                <span>{material.subject}</span>
                <span>•</span>
                <span>{material.fileSize}</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {!isBlocked && (
              <>
                {/* Direct Browser Tab Button for PDF or Image */}
                {isRealCloudUrl && (isPdf || isImageFile) && (
                  <a
                    href={material.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-semibold transition"
                    title="Open Full File in Browser Tab"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
                    <span>Open in Tab</span>
                  </a>
                )}

                {/* Office Document Toggle */}
                {isOfficeFile && isRealCloudUrl && material.fileUrl.startsWith('http') && (
                  <button
                    onClick={() => setEmbedViewMode((m) => (m === 'reader' ? 'embed' : 'reader'))}
                    className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-semibold transition"
                  >
                    {embedViewMode === 'reader' ? 'Office Viewer' : 'Summary Reader'}
                  </button>
                )}

                {/* Zoom controls */}
                <div className="hidden sm:flex items-center bg-slate-800 rounded-lg p-0.5 text-xs text-slate-300">
                  <button
                    onClick={() => setZoom((z) => Math.max(60, z - 15))}
                    className="p-1.5 hover:text-white hover:bg-slate-700 rounded"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-2 font-mono text-[11px]">{zoom}%</span>
                  <button
                    onClick={() => setZoom((z) => Math.min(180, z + 15))}
                    className="p-1.5 hover:text-white hover:bg-slate-700 rounded"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Dark / Light toggle for reader */}
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition text-xs flex items-center gap-1"
                  title="Toggle Theme"
                >
                  {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
                </button>

                {/* Print button */}
                <button
                  onClick={handlePrint}
                  className="hidden sm:flex p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition text-xs items-center gap-1"
                  title="Print Notes"
                >
                  <Printer className="w-4 h-4" />
                </button>

                {/* Download button */}
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition shadow-sm"
                  title="Download Note File"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Download</span>
                </button>

                {/* Fullscreen toggle */}
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="hidden md:flex p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition"
                  title="Fullscreen"
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
              </>
            )}

            {/* Close modal */}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition ml-1"
              title="Close Viewer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        {isBlocked ? (
          <div className="flex-1 overflow-y-auto p-6 sm:p-12 flex flex-col items-center justify-center text-center bg-slate-50">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 border border-amber-200 text-amber-600 flex items-center justify-center mb-4">
              <Lock className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Protected Study Material
            </h3>

            {isPending ? (
              <div className="max-w-md bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-left">
                <div className="flex items-start gap-2.5">
                  <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                      Student Account Status: Pending Approval
                    </h4>
                    <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                      Dear <strong>{currentUser?.name}</strong>, your student registration has been received by <strong>Teaching Junction Coaching</strong> and is currently in the verification queue.
                    </p>
                    <p className="text-xs text-amber-800 mt-2">
                      Once approved by the Director/Admin, you will immediately have 100% free access to all protected PDF, Word, Excel and PPT notes.
                    </p>
                  </div>
                </div>
              </div>
            ) : !currentUser ? (
              <div className="max-w-md text-slate-600 text-sm mb-6 leading-relaxed">
                This study note is exclusive to verified students of Teaching Junction Coaching. Please login or register your student account to get approval.
              </div>
            ) : (
              <div className="max-w-md text-red-600 text-sm mb-6 leading-relaxed bg-red-50 p-4 rounded-xl border border-red-200">
                Your account is currently <strong>{currentUser.status}</strong>. Reason:{' '}
                {currentUser.rejectionReason || 'Please contact coaching administration.'}
              </div>
            )}

            <div className="flex items-center gap-3">
              {!currentUser ? (
                <button
                  onClick={() => {
                    onClose();
                    setAuthModalOpen(true);
                  }}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition"
                >
                  Student Login / Register
                </button>
              ) : isPending ? (
                <div className="text-xs text-slate-500 font-medium">
                  Need urgent access? WhatsApp Helpline: <span className="font-bold text-blue-700">+91 9876543210</span>
                </div>
              ) : null}

              <button
                onClick={onClose}
                className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs rounded-xl transition"
              >
                Back to Materials
              </button>
            </div>
          </div>
        ) : isImageFile && isRealCloudUrl ? (
          /* Image Viewer Mode */
          <div
            className={`flex-1 overflow-auto p-4 sm:p-8 flex items-center justify-center ${
              isDarkMode ? 'bg-slate-950' : 'bg-slate-100'
            }`}
          >
            <div
              style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'center center' }}
              className="transition-transform duration-150 max-w-full"
            >
              <img
                src={material.fileUrl}
                alt={material.title}
                className="max-h-[70vh] w-auto rounded-xl shadow-2xl object-contain border border-slate-300"
              />
            </div>
          </div>
        ) : isOfficeFile && embedViewMode === 'embed' && material.fileUrl.startsWith('http') ? (
          /* Office Online Embedded Viewer */
          <div className="flex-1 w-full h-full min-h-[500px] bg-slate-100">
            <iframe
              src={`https://docs.google.com/viewer?url=${encodeURIComponent(material.fileUrl)}&embedded=true`}
              className="w-full h-full border-0"
              title={material.title}
            />
          </div>
        ) : (
          /* Clean Rich Reader View (Universal across phones, tablets & desktops) */
          <div
            className={`flex-1 overflow-y-auto p-4 sm:p-8 flex flex-col items-center ${
              isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'
            }`}
          >
            {/* Simulation of High-Quality Document Sheet */}
            <div
              style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
              className={`w-full max-w-2xl min-h-[640px] p-6 sm:p-10 rounded-xl shadow-xl transition-all duration-150 relative border ${
                isDarkMode
                  ? 'bg-slate-900 border-slate-800 text-slate-200'
                  : 'bg-white border-slate-200 text-slate-800'
              }`}
            >
              {/* Document Header Watermark */}
              <div className="border-b-2 border-blue-600 pb-4 mb-6 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-bold text-sm tracking-wide">
                    <BookOpen className="w-4 h-4" />
                    <span>TEACHING JUNCTION COACHING</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Official Educational Study Material • Academic Session 2026-27
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                    {material.classCategory}
                  </span>
                  <div className="text-[10px] text-slate-400 mt-1">
                    Format: {fileFormat.toUpperCase()} • Page {currentPage} of {material.pageCount}
                  </div>
                </div>
              </div>

              {/* Watermark in background */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.03] select-none text-5xl font-black rotate-[-25deg] text-center">
                TEACHING JUNCTION COACHING
              </div>

              {/* Material Title Banner */}
              <div className="bg-blue-50 dark:bg-slate-800/80 rounded-xl p-4 mb-6 border border-blue-100 dark:border-slate-700">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">
                  {material.subject} • {material.chapterName}
                </span>
                <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-1">
                  {material.title}
                </h1>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                  {material.description}
                </p>

                {material.fileName && (
                  <div className="mt-3 pt-2 border-t border-blue-200/50 dark:border-slate-700 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">File: {material.fileName}</span>
                    <button
                      onClick={handleDownload}
                      className="text-blue-700 dark:text-blue-400 font-bold hover:underline flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" />
                      <span>Download File ({material.fileSize})</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Content Preview Body */}
              <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm font-sans leading-relaxed whitespace-pre-wrap font-normal">
                {material.contentPreview ||
                  `This document has been uploaded to Teaching Junction Coaching cloud repository.\n\nFile: ${
                    material.fileName || material.title
                  }\nFormat: ${fileFormat.toUpperCase()}\nClass: ${material.classCategory}\nSubject: ${
                    material.subject
                  }\nChapter: ${material.chapterName}\n\nClick the "Download" button at the top toolbar to access the full uncompressed document.`}
              </div>

              {/* Verified Stamp at bottom */}
              <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Verified Coaching Curriculum</span>
                </div>
                <div>Authorized Student Copy</div>
              </div>
            </div>

            {/* Bottom Page Navigation Controls */}
            <div className="mt-6 mb-2 flex items-center gap-3 bg-white dark:bg-slate-800 px-4 py-2 rounded-xl shadow border border-slate-200 dark:border-slate-700 text-xs">
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-medium text-slate-700 dark:text-slate-300">
                Page {currentPage} of {material.pageCount}
              </span>
              <button
                disabled={currentPage >= material.pageCount}
                onClick={() => setCurrentPage((p) => Math.min(material.pageCount, p + 1))}
                className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
