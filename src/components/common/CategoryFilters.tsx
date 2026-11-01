import React from 'react';
import { Filter, Layers, BookMarked, RotateCcw } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ALL_CLASSES, ALL_SUBJECTS } from '../../data/mockData';
import { ClassCategory, SubjectCategory } from '../../types';

interface Props {
  showSubjects?: boolean;
}

export const CategoryFilters: React.FC<Props> = ({ showSubjects = true }) => {
  const {
    selectedClass,
    setSelectedClass,
    selectedSubject,
    setSelectedSubject,
    searchQuery,
    setSearchQuery,
  } = useApp();

  const isFiltered = selectedClass !== 'all' || selectedSubject !== 'all' || searchQuery.length > 0;

  const resetFilters = () => {
    setSelectedClass('all');
    setSelectedSubject('all');
    setSearchQuery('');
  };

  return (
    <div className="space-y-2.5">
      {/* Class Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
        <div className="flex items-center gap-1.5 font-bold text-slate-700 shrink-0 pr-1">
          <Layers className="w-3.5 h-3.5 text-blue-700" />
          <span className="hidden sm:inline">Class:</span>
        </div>

        <button
          onClick={() => setSelectedClass('all')}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition shrink-0 ${
            selectedClass === 'all'
              ? 'bg-blue-700 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          All Classes
        </button>

        {ALL_CLASSES.map((cls) => {
          const isSelected = selectedClass === cls;
          return (
            <button
              key={cls}
              onClick={() => setSelectedClass(cls)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition shrink-0 ${
                isSelected
                  ? 'bg-blue-700 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              {cls}
            </button>
          );
        })}

        {isFiltered && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 text-xs font-semibold whitespace-nowrap shrink-0 transition"
            title="Reset Filters"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Subject Category Pills */}
      {showSubjects && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          <div className="flex items-center gap-1.5 font-bold text-slate-700 shrink-0 pr-1">
            <BookMarked className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">Subject:</span>
          </div>

          <button
            onClick={() => setSelectedSubject('all')}
            className={`px-3 py-1 rounded-lg font-bold whitespace-nowrap transition shrink-0 ${
              selectedSubject === 'all'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Subjects
          </button>

          {ALL_SUBJECTS.map((sub) => {
            const isSelected = selectedSubject === sub;
            return (
              <button
                key={sub}
                onClick={() => setSelectedSubject(sub)}
                className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition shrink-0 ${
                  isSelected
                    ? 'bg-slate-800 text-white font-bold shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {sub}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
