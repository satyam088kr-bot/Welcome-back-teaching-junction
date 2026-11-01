import React, { useState } from 'react';
import {
  AlertCircle,
  BookOpen,
  Calendar,
  CheckCircle,
  Download,
  Edit,
  Eye,
  FileCode,
  FileSpreadsheet,
  FileText,
  FileUp,
  Filter,
  Image as ImageIcon,
  Lock,
  Plus,
  Presentation,
  Search,
  Sparkles,
  Trash2,
  Upload,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ALL_CLASSES, ALL_SUBJECTS } from '../../data/mockData';
import { ClassCategory, FileFormat, StudyMaterial, SubjectCategory } from '../../types';
import { EditNoteModal } from './EditNoteModal';

interface Props {
  onNavigateToUpload: () => void;
  onViewNote: (material: StudyMaterial) => void;
}

export const ManageNotesTab: React.FC<Props> = ({ onNavigateToUpload, onViewNote }) => {
  const { materials, updateMaterial, deleteMaterial, addToast } = useApp();

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState<ClassCategory | 'all'>('all');
  const [subjectFilter, setSubjectFilter] = useState<SubjectCategory | 'all'>('all');
  const [formatFilter, setFormatFilter] = useState<string>('all');

  // Edit Modal State
  const [editingNote, setEditingNote] = useState<StudyMaterial | null>(null);

  // Delete Confirmation State
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Filtered materials
  const filteredMaterials = materials.filter((m) => {
    if (classFilter !== 'all' && m.classCategory !== classFilter) return false;
    if (subjectFilter !== 'all' && m.subject !== subjectFilter) return false;

    if (formatFilter !== 'all') {
      const fmt = (m.fileFormat || 'pdf').toLowerCase();
      if (formatFilter === 'pdf' && fmt !== 'pdf') return false;
      if (formatFilter === 'word' && !['doc', 'docx'].includes(fmt)) return false;
      if (formatFilter === 'excel' && !['xls', 'xlsx'].includes(fmt)) return false;
      if (formatFilter === 'ppt' && !['ppt', 'pptx'].includes(fmt)) return false;
      if (formatFilter === 'image' && !['jpg', 'jpeg', 'png'].includes(fmt)) return false;
      if (formatFilter === 'txt' && fmt !== 'txt') return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = m.title.toLowerCase().includes(q);
      const matchSubject = m.subject.toLowerCase().includes(q);
      const matchChapter = m.chapterName.toLowerCase().includes(q);
      const matchClass = m.classCategory.toLowerCase().includes(q);
      if (!matchTitle && !matchSubject && !matchChapter && !matchClass) return false;
    }

    return true;
  });

  const getFormatBadge = (fmt?: FileFormat) => {
    const f = (fmt || 'pdf').toLowerCase();
    switch (f) {
      case 'pdf':
        return <span className="bg-red-50 text-red-700 border border-red-200 font-bold px-2 py-0.5 rounded text-[10px]">PDF</span>;
      case 'doc':
      case 'docx':
        return <span className="bg-blue-50 text-blue-700 border border-blue-200 font-bold px-2 py-0.5 rounded text-[10px]">WORD</span>;
      case 'xls':
      case 'xlsx':
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold px-2 py-0.5 rounded text-[10px]">EXCEL</span>;
      case 'ppt':
      case 'pptx':
        return <span className="bg-amber-50 text-amber-700 border border-amber-200 font-bold px-2 py-0.5 rounded text-[10px]">PPT</span>;
      case 'jpg':
      case 'jpeg':
      case 'png':
        return <span className="bg-purple-50 text-purple-700 border border-purple-200 font-bold px-2 py-0.5 rounded text-[10px]">IMAGE</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 border border-slate-200 font-bold px-2 py-0.5 rounded text-[10px]">TXT</span>;
    }
  };

  const handleDelete = (id: string) => {
    deleteMaterial(id);
    setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Banner & Action */}
      <div className="flex items-center justify-between flex-wrap gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">Manage Uploaded Study Notes</h2>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
              {materials.length} Notes Total
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            View, edit, replace file, and delete study notes stored in Firebase Cloud Storage. Changes reflect instantly on student dashboards.
          </p>
        </div>

        <button
          onClick={onNavigateToUpload}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>Upload New Notes</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search Box */}
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by title, chapter, subject, or class..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
            />
          </div>

          {/* Class Filter */}
          <div className="sm:col-span-4">
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value as ClassCategory | 'all')}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 font-semibold"
            >
              <option value="all">All Classes (6th to 12th + Competitive)</option>
              {ALL_CLASSES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Format Filter */}
          <div className="sm:col-span-3">
            <select
              value={formatFilter}
              onChange={(e) => setFormatFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
            >
              <option value="all">All Formats</option>
              <option value="pdf">PDF Documents</option>
              <option value="word">Word (DOC/DOCX)</option>
              <option value="excel">Excel (XLS/XLSX)</option>
              <option value="ppt">PowerPoint (PPT)</option>
              <option value="image">Images (JPG/PNG)</option>
              <option value="txt">Text Notes</option>
            </select>
          </div>
        </div>

        {/* Quick Format Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] pt-1">
          <span className="text-slate-400 font-bold shrink-0">Quick Filter:</span>
          {[
            { id: 'all', label: 'All' },
            { id: 'pdf', label: 'PDF' },
            { id: 'word', label: 'Word' },
            { id: 'excel', label: 'Excel' },
            { id: 'ppt', label: 'PPT' },
            { id: 'image', label: 'Images' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFormatFilter(item.id)}
              className={`px-2.5 py-0.5 rounded-lg font-semibold transition shrink-0 ${
                formatFilter === item.id
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
          <span className="text-slate-400 text-xs ml-auto shrink-0">
            Showing <strong className="text-slate-800">{filteredMaterials.length}</strong> of {materials.length}
          </span>
        </div>
      </div>

      {/* Notes Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        {filteredMaterials.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-3">Notes Title & Chapter</th>
                  <th className="py-3 px-3">Grade & Subject</th>
                  <th className="py-3 px-3">Format</th>
                  <th className="py-3 px-3">Size / Pages</th>
                  <th className="py-3 px-3">Upload Date</th>
                  <th className="py-3 px-3">Access Level</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMaterials.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-3 font-semibold text-slate-900 max-w-xs">
                      <div className="truncate font-bold text-slate-900" title={m.title}>
                        {m.title}
                      </div>
                      <div className="text-[10px] text-slate-400 font-normal truncate">
                        {m.chapterName}
                        {m.fileName && <span className="ml-1 text-slate-400">• {m.fileName}</span>}
                      </div>
                    </td>

                    <td className="py-3 px-3 text-slate-600">
                      <span className="font-bold text-slate-800">{m.classCategory}</span>
                      <div className="text-[10px] text-blue-700 font-medium">{m.subject}</div>
                    </td>

                    <td className="py-3 px-3">
                      {getFormatBadge(m.fileFormat)}
                    </td>

                    <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">
                      <div>{m.fileSize}</div>
                      <div className="text-[10px] text-slate-400 font-sans">{m.pageCount} Pages</div>
                    </td>

                    <td className="py-3 px-3 text-slate-500 text-[11px]">
                      {m.uploadDate || m.createdAt.split('T')[0]}
                    </td>

                    <td className="py-3 px-3">
                      {m.isProtected ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                          <Lock className="w-2.5 h-2.5 text-amber-600" />
                          Approved Only
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                          Public
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Preview Note */}
                        <button
                          onClick={() => onViewNote(m)}
                          className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition"
                          title="Preview Document"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Edit Note & Replace File */}
                        <button
                          onClick={() => setEditingNote(m)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Edit Note & Replace File"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        {/* Delete Note */}
                        {deleteConfirmId === m.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleDelete(m.id)}
                              className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[10px] font-bold transition"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="px-2 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-[10px] font-semibold"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirmId(m.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Delete Study Note"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-sm">No Study Notes Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {searchQuery || classFilter !== 'all' || formatFilter !== 'all'
                ? 'No notes match your active filters. Try clearing search or filters.'
                : 'No study notes have been uploaded yet.'}
            </p>
            <button
              onClick={onNavigateToUpload}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition inline-flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload First Note</span>
            </button>
          </div>
        )}
      </div>

      {/* Edit Note Modal */}
      {editingNote && (
        <EditNoteModal
          material={editingNote}
          isOpen={true}
          onClose={() => setEditingNote(null)}
          onSave={(updates) => {
            updateMaterial(editingNote.id, updates);
            setEditingNote(null);
          }}
        />
      )}
    </div>
  );
};
