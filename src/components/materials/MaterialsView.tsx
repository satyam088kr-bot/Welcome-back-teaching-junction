import React, { useState } from 'react';
import { BookOpen, FileText, Filter, Lock, Search, ShieldAlert, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MaterialCard } from './MaterialCard';
import { CategoryFilters } from '../common/CategoryFilters';
import { MaterialType, StudyMaterial } from '../../types';

export const MaterialsView: React.FC = () => {
  const {
    materials,
    selectedClass,
    selectedSubject,
    searchQuery,
    setSearchQuery,
    setActivePdfMaterial,
    currentUser,
  } = useApp();

  const [selectedType, setSelectedType] = useState<MaterialType | 'all'>('all');
  const [selectedFormat, setSelectedFormat] = useState<string>('all');

  const isPending = currentUser && currentUser.status === 'pending';

  // Filter materials based on search, class, subject, type, and file format
  const filteredMaterials = materials.filter((mat) => {
    if (selectedClass !== 'all' && mat.classCategory !== selectedClass) return false;
    if (selectedSubject !== 'all' && mat.subject !== selectedSubject) return false;
    if (selectedType !== 'all' && mat.type !== selectedType) return false;

    if (selectedFormat !== 'all') {
      const fmt = (mat.fileFormat || 'pdf').toLowerCase();
      if (selectedFormat === 'pdf' && fmt !== 'pdf') return false;
      if (selectedFormat === 'word' && !['doc', 'docx'].includes(fmt)) return false;
      if (selectedFormat === 'excel' && !['xls', 'xlsx'].includes(fmt)) return false;
      if (selectedFormat === 'ppt' && !['ppt', 'pptx'].includes(fmt)) return false;
      if (selectedFormat === 'image' && !['jpg', 'jpeg', 'png'].includes(fmt)) return false;
      if (selectedFormat === 'txt' && fmt !== 'txt') return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = mat.title.toLowerCase().includes(q);
      const matchSubject = mat.subject.toLowerCase().includes(q);
      const matchChapter = mat.chapterName.toLowerCase().includes(q);
      const matchClass = mat.classCategory.toLowerCase().includes(q);
      if (!matchTitle && !matchSubject && !matchChapter && !matchClass) return false;
    }

    return true;
  });

  const types: { id: MaterialType | 'all'; label: string }[] = [
    { id: 'all', label: 'All Content' },
    { id: 'handwritten_notes', label: 'Handwritten Notes' },
    { id: 'formula_sheet', label: 'Formula Sheets' },
    { id: 'ncert_solution', label: 'NCERT Solutions' },
    { id: 'pyq_paper', label: 'Previous Year Papers' },
    { id: 'sample_paper', label: 'Sample Papers' },
  ];

  const formatFilters = [
    { id: 'all', label: 'All Formats' },
    { id: 'pdf', label: 'PDF Documents' },
    { id: 'word', label: 'Word (DOC/DOCX)' },
    { id: 'excel', label: 'Excel (XLS/XLSX)' },
    { id: 'ppt', label: 'PowerPoint (PPT)' },
    { id: 'image', label: 'Images (JPG/PNG)' },
    { id: 'txt', label: 'Text Notes' },
  ];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-800 via-blue-700 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Coaching Curriculum</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-black tracking-tight leading-tight">
            Study Materials & Downloadable PDF Notes
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
            Access chapter-wise formula handbooks, NCERT solutions, teacher handwritten lecture summaries, and board examination question papers with model answers.
          </p>
        </div>
      </div>

      {/* Pending Account Notice Banner */}
      {isPending && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 shadow-xs">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900">
            <span className="font-bold">Student Account Awaiting Administrative Approval:</span> You have registered as <strong>{currentUser.name}</strong> ({currentUser.assignedClass}). While pending verification, protected PDF notes remain locked. The administration reviews new applications continually.
          </div>
        </div>
      )}

      {/* Filter and Search Bar Section */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm space-y-4">
        {/* Class and Subject Filters */}
        <CategoryFilters showSubjects={true} />

        {/* File Format Pills */}
        <div className="pt-2 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1 text-xs scrollbar-none">
          <div className="text-xs font-bold text-slate-400 shrink-0 pr-1">Format:</div>
          {formatFilters.map((fmt) => {
            const isSelected = selectedFormat === fmt.id;
            return (
              <button
                key={fmt.id}
                onClick={() => setSelectedFormat(fmt.id)}
                className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition shrink-0 ${
                  isSelected
                    ? 'bg-blue-600 text-white font-bold shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {fmt.label}
              </button>
            );
          })}
        </div>

        {/* Content Type Pills */}
        <div className="pt-2 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1 text-xs scrollbar-none">
          <div className="text-xs font-bold text-slate-400 shrink-0 pr-1">Category:</div>
          {types.map((t) => {
            const isSelected = selectedType === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setSelectedType(t.id)}
                className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition shrink-0 ${
                  isSelected
                    ? 'bg-slate-800 text-white font-bold shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Materials Count & Search Results Info */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <div>
          Showing <span className="font-bold text-slate-800">{filteredMaterials.length}</span> study materials
          {selectedClass !== 'all' && <span> for <strong>{selectedClass}</strong></span>}
          {selectedSubject !== 'all' && <span> in <strong>{selectedSubject}</strong></span>}
        </div>
      </div>

      {/* Materials Grid */}
      {filteredMaterials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMaterials.map((mat) => (
            <MaterialCard
              key={mat.id}
              material={mat}
              onView={(m) => setActivePdfMaterial(m)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <BookOpen className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No Study Materials Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No notes match your selected class, subject or search term. Try resetting your filters to view all available resources.
          </p>
        </div>
      )}
    </div>
  );
};
