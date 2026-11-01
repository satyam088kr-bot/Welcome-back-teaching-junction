import React from 'react';
import {
  BookOpen,
  Download,
  Eye,
  FileCheck,
  FileText,
  Lock,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StudyMaterial } from '../../types';

interface Props {
  material: StudyMaterial;
  onView: (material: StudyMaterial) => void;
}

export const MaterialCard: React.FC<Props> = ({ material, onView }) => {
  const { currentUser, incrementDownload, addToast } = useApp();

  const isApproved = currentUser?.role === 'admin' || currentUser?.status === 'approved';
  const isPending = currentUser && currentUser.status === 'pending';
  const isProtectedLocked = material.isProtected && !isApproved;

  const typeLabels: Record<string, { label: string; color: string }> = {
    ncert_solution: { label: 'NCERT Solution', color: 'bg-emerald-100 text-emerald-800' },
    handwritten_notes: { label: 'Handwritten Notes', color: 'bg-blue-100 text-blue-800' },
    formula_sheet: { label: 'Formula Sheet', color: 'bg-purple-100 text-purple-800' },
    pyq_paper: { label: '10-Yr Solved PYQ', color: 'bg-amber-100 text-amber-800' },
    sample_paper: { label: 'Sample Paper', color: 'bg-slate-100 text-slate-800' },
  };

  const currentType = typeLabels[material.type] || {
    label: 'Study Material',
    color: 'bg-blue-100 text-blue-800',
  };

  const handleDownloadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isProtectedLocked) {
      addToast({
        type: 'warning',
        title: 'Protected PDF Note',
        message: isPending
          ? 'Your registration is pending admin approval. Protected notes unlock upon approval.'
          : 'Please sign in with an approved student account to download.',
      });
      return;
    }

    onView(material);
  };

  return (
    <div
      onClick={() => onView(material)}
      className="group bg-white rounded-2xl border border-slate-200/90 hover:border-blue-400 shadow-sm hover:shadow-lg transition-all duration-200 p-4 sm:p-5 flex flex-col justify-between cursor-pointer space-y-4"
    >
      <div>
        {/* Top Tag Row */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${currentType.color}`}>
              {currentType.label}
            </span>
            <span className="uppercase text-[9px] font-black px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
              {material.fileFormat || 'PDF'}
            </span>
          </div>
          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-lg">
            {material.classCategory}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition line-clamp-2 leading-snug">
          {material.title}
        </h3>

        {/* Chapter / Subject */}
        <div className="text-xs text-blue-600 font-medium mt-1">
          {material.subject} • {material.chapterName}
        </div>

        {/* Description snippet */}
        <p className="text-xs text-slate-600 line-clamp-2 mt-2 leading-relaxed">
          {material.description}
        </p>
      </div>

      {/* Metadata & Actions */}
      <div className="pt-3 border-t border-slate-100 space-y-3">
        <div className="flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            <span>{material.pageCount} Pages</span>
            <span>•</span>
            <span>{material.fileSize}</span>
          </div>

          <div className="text-slate-400">
            {material.downloadCount.toLocaleString()} downloads
          </div>
        </div>

        {/* Action Button */}
        {isProtectedLocked ? (
          <div className="w-full py-2 bg-amber-50 text-amber-800 text-xs font-semibold rounded-xl border border-amber-200/80 flex items-center justify-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-amber-600" />
            <span>{isPending ? 'Approval Pending (Locked)' : 'Login to Unlock PDF'}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onView(material);
              }}
              className="flex-1 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Read Online</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadClick}
              className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition flex items-center justify-center shadow-xs"
              title="Download Note"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
