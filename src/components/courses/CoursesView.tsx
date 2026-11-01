import React from 'react';
import { BookOpen, CheckCircle, Flame, Layers, Search, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CourseCard } from './CourseCard';
import { CategoryFilters } from '../common/CategoryFilters';
import { Course } from '../../types';

interface Props {
  courseTypeFilter?: 'free' | 'paid' | 'all';
}

export const CoursesView: React.FC<Props> = ({ courseTypeFilter = 'all' }) => {
  const {
    courses,
    selectedClass,
    selectedSubject,
    searchQuery,
    setSelectedCourseId,
    setCurrentTab,
  } = useApp();

  const handleSelectCourse = (course: Course) => {
    setSelectedCourseId(course.id);
    setCurrentTab('course_detail');
  };

  // Filter courses
  const filteredCourses = courses.filter((c) => {
    if (courseTypeFilter !== 'all' && c.type !== courseTypeFilter) return false;
    if (selectedClass !== 'all' && c.classCategory !== selectedClass) return false;
    if (selectedSubject !== 'all' && c.subject !== selectedSubject) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = c.title.toLowerCase().includes(q);
      const matchSubject = c.subject.toLowerCase().includes(q);
      const matchClass = c.classCategory.toLowerCase().includes(q);
      const matchDesc = c.description.toLowerCase().includes(q);
      if (!matchTitle && !matchSubject && !matchClass && !matchDesc) return false;
    }

    return true;
  });

  const pageTitle =
    courseTypeFilter === 'free'
      ? 'Free Foundation Batches & NCERT Video Lectures'
      : courseTypeFilter === 'paid'
      ? 'Premium Live & Crash Courses (100% Target Batches)'
      : 'All Available Courses & Classes';

  const pageSubtitle =
    courseTypeFilter === 'free'
      ? 'Start learning immediately with our 100% free courses. Includes syllabus lectures, chapter summaries, and free preview study notes.'
      : courseTypeFilter === 'paid'
      ? 'Comprehensive exam-cracking batches with test series, full PDF formula books, homework sheets, and personal teacher guidance.'
      : 'Browse our full coaching curriculum for Classes 6th to 12th and Competitive Examinations.';

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Banner */}
      <div
        className={`rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden ${
          courseTypeFilter === 'free'
            ? 'bg-gradient-to-r from-emerald-800 via-teal-800 to-blue-900'
            : 'bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900'
        }`}
      >
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Teaching Junction Coaching Programs</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-black tracking-tight leading-tight">
            {pageTitle}
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
            {pageSubtitle}
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm space-y-4">
        <CategoryFilters showSubjects={true} />
      </div>

      {/* Course Count */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <div>
          Showing <span className="font-bold text-slate-900">{filteredCourses.length}</span> courses
          {selectedClass !== 'all' && <span> in <strong>{selectedClass}</strong></span>}
          {selectedSubject !== 'all' && <span> for <strong>{selectedSubject}</strong></span>}
        </div>
      </div>

      {/* Courses Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((c) => (
            <CourseCard key={c.id} course={c} onSelect={handleSelectCourse} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <Layers className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No Courses Match Your Criteria</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            We are adding new lecture batches every week. Try clearing your class or subject filter to explore other available courses.
          </p>
        </div>
      )}
    </div>
  );
};
