import React, { useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  CheckCircle,
  Clock,
  Download,
  FileText,
  GraduationCap,
  Lock,
  Play,
  PlayCircle,
  Share2,
  ShieldAlert,
  Star,
  Users,
  AlertCircle,
  Video,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Course, Lesson, StudyMaterial } from '../../types';

interface Props {
  course: Course;
  onBack: () => void;
}

export const CourseDetailView: React.FC<Props> = ({ course, onBack }) => {
  const {
    currentUser,
    setCheckoutCourse,
    enrollInFreeCourse,
    setActivePdfMaterial,
    setAuthModalOpen,
    addToast,
  } = useApp();

  const isEnrolled = currentUser?.enrolledCourseIds.includes(course.id) || currentUser?.role === 'admin';
  const isApproved = currentUser?.role === 'admin' || currentUser?.status === 'approved';

  // Find first lesson for initial active player state
  const firstLesson = course.chapters[0]?.lessons[0] || null;
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(firstLesson);
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    course.chapters.forEach((ch, idx) => {
      initial[ch.id] = idx === 0; // expand first chapter by default
    });
    return initial;
  });

  const toggleChapter = (chId: string) => {
    setExpandedChapters((prev) => ({ ...prev, [chId]: !prev[chId] }));
  };

  const handleLessonClick = (lesson: Lesson) => {
    // Check permission to view lesson
    if (course.type === 'paid' && !isEnrolled && !lesson.isFreePreview) {
      addToast({
        type: 'warning',
        title: 'Premium Lesson Locked',
        message: 'Enroll in this course to unlock all chapters and video lectures.',
      });
      return;
    }

    if (course.type === 'free' && !isApproved && !lesson.isFreePreview) {
      addToast({
        type: 'warning',
        title: 'Account Approval Required',
        message: 'Your account is pending verification before accessing full lectures.',
      });
      return;
    }

    setActiveLesson(lesson);
  };

  const handleOpenPdfNote = (lesson: Lesson) => {
    if (!isApproved) {
      addToast({
        type: 'warning',
        title: 'Protected Note',
        message: 'Only approved students can open lecture PDF notes.',
      });
      return;
    }

    // Wrap lesson note into a study material object for the PDF viewer
    const material: StudyMaterial = {
      id: 'mat-lesson-' + lesson.id,
      title: lesson.pdfTitle || `${lesson.title} - Lecture Notes`,
      description: `Official handwritten lecture notes for ${course.title} - ${lesson.title}`,
      classCategory: course.classCategory,
      subject: course.subject,
      chapterName: course.chapters.find((c) => c.lessons.some((l) => l.id === lesson.id))?.title || 'Lecture Note',
      fileUrl: lesson.pdfNoteUrl || '/mock/notes.pdf',
      fileSize: '3.4 MB',
      pageCount: 16,
      downloadCount: 420,
      type: 'handwritten_notes',
      isProtected: true,
      createdAt: new Date().toISOString(),
      contentPreview: `TEACHING JUNCTION COACHING
COURSE: ${course.title}
LESSON: ${lesson.title}
INSTRUCTOR: ${course.instructor}

Summary of Concepts Covered:
${lesson.summary || 'Complete classroom blackboard notes, formulas, and board exam tips.'}

Key Formulae & Definitions:
- Verified according to NCERT and Board Guidelines 2026-27.
- Practice each derivation twice before the exam.

All rights reserved © Teaching Junction Coaching.`,
    };

    setActivePdfMaterial(material);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: course.title,
        text: `Check out ${course.title} on Teaching Junction Coaching!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      addToast({ type: 'info', title: 'Link Copied to Clipboard' });
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Top back button and breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-700 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Courses</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white p-2 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 shadow-2xs"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Share Course</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Player & Details Left, Syllabus & Sticky Enroll Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Player / Hero Video and Overview */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video Player Box */}
          <div className="bg-slate-950 rounded-2xl overflow-hidden shadow-xl border border-slate-800">
            {activeLesson ? (
              <div>
                <div className="relative aspect-video w-full bg-slate-900 flex items-center justify-center">
                  {/* Interactive simulated high-yield lecture video */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white bg-gradient-to-t from-slate-950/90 via-slate-900/60 to-transparent">
                    <div className="w-16 h-16 rounded-full bg-blue-600/90 text-white flex items-center justify-center shadow-lg mb-3 hover:scale-110 transition cursor-pointer">
                      <Play className="w-8 h-8 fill-white ml-1" />
                    </div>
                    <div className="text-xs uppercase tracking-wider font-bold text-amber-400">
                      Now Playing Lecture
                    </div>
                    <h3 className="text-base sm:text-lg font-bold mt-1 max-w-lg">
                      {activeLesson.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-slate-300 mt-2">
                      <span>{activeLesson.duration}</span>
                      <span>•</span>
                      <span>Teacher: {course.instructor}</span>
                    </div>
                  </div>

                  {/* Top Bar inside Player */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                    <span className="bg-blue-900/80 px-2.5 py-1 rounded-md font-mono font-bold backdrop-blur-xs">
                      HD 1080p
                    </span>
                    {activeLesson.isFreePreview && (
                      <span className="bg-emerald-600 px-2.5 py-1 rounded-md font-bold text-[11px]">
                        Free Demo Lesson
                      </span>
                    )}
                  </div>
                </div>

                {/* Lesson Action Bar */}
                <div className="bg-slate-900 p-3 sm:p-4 text-white flex items-center justify-between gap-3 border-t border-slate-800 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-blue-400" />
                    <span className="text-xs font-semibold text-slate-200 truncate max-w-xs">
                      {activeLesson.title}
                    </span>
                  </div>

                  {activeLesson.pdfNoteUrl && (
                    <button
                      onClick={() => handleOpenPdfNote(activeLesson)}
                      className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-xs"
                    >
                      <FileText className="w-3.5 h-3.5 text-amber-300" />
                      <span>Open Lecture PDF Notes</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="aspect-video flex items-center justify-center text-slate-400 text-sm">
                Select a lesson from syllabus to start learning.
              </div>
            )}
          </div>

          {/* Course Overview & Description */}
          <div className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200/90 shadow-sm space-y-5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-blue-100 text-blue-800">
                {course.classCategory}
              </span>
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-700">
                {course.subject}
              </span>
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-100 text-amber-800">
                {course.language}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
              {course.title}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {course.description}
            </p>

            {/* Instructor Box */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-700 text-white flex items-center justify-center font-bold text-base shrink-0">
                <GraduationCap className="w-6 h-6 text-amber-300" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-blue-700 tracking-wider">
                  Lead Instructor & Senior Faculty
                </div>
                <div className="text-sm font-bold text-slate-900">{course.instructor}</div>
                <div className="text-xs text-slate-500">
                  Dedicated coaching, student doubt-solving, and exam-oriented methodology.
                </div>
              </div>
            </div>

            {/* Key Features Checklist */}
            <div className="pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                What You Will Get In This Course
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Full syllabus coverage with detailed concepts</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>High quality downloadable chapter-wise PDF notes</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Last 10 Years Board Exam Questions solved</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Weekly doubt-solving support by faculty</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Enrollment Card & Syllabus Drawer */}
        <div className="space-y-6">
          {/* Enrollment / Status Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-md space-y-4">
            <div className="flex items-baseline justify-between">
              <div>
                {course.type === 'free' ? (
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-emerald-600">FREE</span>
                    <span className="text-xs text-slate-400 line-through">₹{course.originalPrice || 1499}</span>
                  </div>
                ) : (
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-blue-700">₹{course.price}</span>
                    {course.originalPrice && (
                      <span className="text-xs text-slate-400 line-through">₹{course.originalPrice}</span>
                    )}
                  </div>
                )}
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Full lifetime access including PDF notes & test papers
                </div>
              </div>
            </div>

            {/* Enrolled vs Enroll button */}
            {isEnrolled ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <div className="font-bold">You are Enrolled!</div>
                  <div className="text-[11px] text-emerald-700">Enjoy full access to all lectures and study materials.</div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => {
                  if (course.type === 'free') {
                    enrollInFreeCourse(course.id);
                  } else {
                    setCheckoutCourse(course);
                  }
                }}
                className={`w-full py-3 rounded-xl font-bold text-xs shadow-md transition active:scale-98 ${
                  course.type === 'free'
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {course.type === 'free' ? 'Enroll For Free Now' : 'Enroll Now (Pay ₹' + course.price + ')'}
              </button>
            )}

            <div className="pt-2 border-t border-slate-100 space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span className="text-slate-400">Total Duration:</span>
                <span className="font-medium text-slate-800">{course.duration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Chapters:</span>
                <span className="font-medium text-slate-800">{course.chapters.length} Chapters</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Students Enrolled:</span>
                <span className="font-medium text-slate-800">{course.enrolledCount} Students</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Rating:</span>
                <span className="font-bold text-amber-500 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  {course.rating.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Complete Course Curriculum / Chapters Accordion */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span>Course Curriculum ({course.chapters.length} Ch)</span>
              </h2>
            </div>

            <div className="space-y-3">
              {course.chapters.map((chapter) => {
                const isExpanded = expandedChapters[chapter.id] !== false;
                return (
                  <div
                    key={chapter.id}
                    className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50"
                  >
                    <button
                      onClick={() => toggleChapter(chapter.id)}
                      className="w-full px-3.5 py-2.5 text-left font-bold text-xs text-slate-800 flex items-center justify-between hover:bg-slate-100 transition"
                    >
                      <span className="truncate pr-2">{chapter.title}</span>
                      <span className="text-[11px] text-blue-600 font-semibold shrink-0">
                        {chapter.lessons.length} Lectures
                      </span>
                    </button>

                    {isExpanded && (
                      <div className="divide-y divide-slate-100 bg-white">
                        {chapter.lessons.map((lesson) => {
                          const isCurrent = activeLesson?.id === lesson.id;
                          const isLocked =
                            course.type === 'paid' && !isEnrolled && !lesson.isFreePreview;

                          return (
                            <div
                              key={lesson.id}
                              onClick={() => handleLessonClick(lesson)}
                              className={`p-3 flex items-center justify-between gap-2.5 text-xs transition cursor-pointer ${
                                isCurrent
                                  ? 'bg-blue-50/80 border-l-4 border-blue-600'
                                  : 'hover:bg-slate-50'
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                {isLocked ? (
                                  <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                ) : isCurrent ? (
                                  <PlayCircle className="w-4 h-4 text-blue-600 shrink-0" />
                                ) : (
                                  <Play className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                )}
                                <div className="min-w-0">
                                  <div
                                    className={`truncate font-medium ${
                                      isCurrent
                                        ? 'text-blue-900 font-bold'
                                        : isLocked
                                        ? 'text-slate-400'
                                        : 'text-slate-800'
                                    }`}
                                  >
                                    {lesson.title}
                                  </div>
                                  <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                                    <span>{lesson.duration}</span>
                                    {lesson.isFreePreview && (
                                      <span className="text-emerald-600 font-bold">Free Preview</span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {lesson.pdfNoteUrl && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenPdfNote(lesson);
                                  }}
                                  className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg shrink-0"
                                  title="View Lesson PDF Notes"
                                >
                                  <FileText className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
