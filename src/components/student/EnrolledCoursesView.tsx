import React from 'react';
import {
  BookOpen,
  CheckCircle,
  Clock,
  Layers,
  PlayCircle,
  ShieldAlert,
  Sparkles,
  CreditCard,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Course } from '../../types';

export const EnrolledCoursesView: React.FC = () => {
  const {
    currentUser,
    courses,
    payments,
    setSelectedCourseId,
    setCurrentTab,
    setAuthModalOpen,
  } = useApp();

  if (!currentUser) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center max-w-md mx-auto my-12 space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center mx-auto">
          <BookOpen className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Student Sign In Required</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          Please log in or register your student account to view your enrolled courses, learning progress, and study materials.
        </p>
        <button
          onClick={() => setAuthModalOpen(true)}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow transition"
        >
          Sign In / Register
        </button>
      </div>
    );
  }

  const enrolledCourseIds = currentUser.enrolledCourseIds || [];
  const enrolledCourses = courses.filter((c) => enrolledCourseIds.includes(c.id));

  // Find user's payment records
  const userPayments = payments.filter((p) => p.studentId === currentUser.id);

  const handleOpenCourse = (course: Course) => {
    setSelectedCourseId(course.id);
    setCurrentTab('course_detail');
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>My Learning Portal</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-black">
            Welcome back, {currentUser.name}!
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
            You are enrolled in <strong className="text-white">{enrolledCourses.length} courses</strong>. Continue where you left off or explore lecture notes.
          </p>
        </div>
      </div>

      {/* Account Status Alert if not approved */}
      {currentUser.status !== 'approved' && currentUser.role !== 'admin' && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 shadow-2xs">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900">
            <span className="font-bold">Account Status: {currentUser.status.toUpperCase()}</span>
            <p className="mt-0.5">
              Your student registration is being reviewed by the administration. Protected course notes and certificates unlock automatically upon verification.
            </p>
          </div>
        </div>
      )}

      {/* Enrolled Courses Grid */}
      <div>
        <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-600" />
          <span>Active Course Enrollments ({enrolledCourses.length})</span>
        </h2>

        {enrolledCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map((course) => {
              const totalLessons = course.chapters.reduce(
                (acc, ch) => acc + ch.lessons.length,
                0
              );
              // Simulated progress tracker
              const progressPct = 40;

              return (
                <div
                  key={course.id}
                  onClick={() => handleOpenCourse(course)}
                  className="bg-white rounded-2xl border border-slate-200/90 hover:border-blue-400 shadow-sm hover:shadow-xl transition-all duration-200 overflow-hidden flex flex-col justify-between cursor-pointer"
                >
                  <div>
                    <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2.5 left-2.5 bg-blue-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-lg shadow-sm">
                        {course.classCategory}
                      </div>
                      <div className="absolute top-2.5 right-2.5 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-sm">
                        <CheckCircle className="w-3 h-3 text-white" />
                        <span>Enrolled</span>
                      </div>
                    </div>

                    <div className="p-4 space-y-3">
                      <div>
                        <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wide">
                          {course.subject}
                        </span>
                        <h3 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug mt-0.5">
                          {course.title}
                        </h3>
                      </div>

                      {/* Learning Progress Bar */}
                      <div>
                        <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                          <span>Learning Progress</span>
                          <span className="font-bold text-blue-700">{progressPct}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            style={{ width: `${progressPct}%` }}
                            className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500"
                          />
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
                        <span>{course.duration}</span>
                        <span>{totalLessons} Lectures</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 pt-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenCourse(course);
                      }}
                      className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5"
                    >
                      <PlayCircle className="w-4 h-4" />
                      <span>Resume Watching</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <Layers className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900">You haven't enrolled in any courses yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Start with our free NCERT foundation courses or explore premium target batches to begin your board exam preparation.
            </p>
            <button
              onClick={() => setCurrentTab('free_courses')}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow transition"
            >
              Browse Free Courses
            </button>
          </div>
        )}
      </div>

      {/* Submitted Payment Verification History */}
      {userPayments.length > 0 && (
        <div className="pt-4">
          <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-600" />
            <span>Course Payment Verification Records</span>
          </h2>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs divide-y divide-slate-100">
            {userPayments.map((pay) => (
              <div key={pay.id} className="p-4 flex items-center justify-between gap-4 flex-wrap text-xs">
                <div>
                  <div className="font-bold text-slate-900">{pay.courseTitle}</div>
                  <div className="text-slate-500 mt-0.5">
                    UTR/Ref: <span className="font-mono font-bold text-slate-800">{pay.transactionId}</span> • Amount: <strong className="text-blue-700">₹{pay.amount}</strong>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Submitted: {new Date(pay.submittedAt).toLocaleString()}
                  </div>
                </div>

                <div>
                  {pay.status === 'verified' ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[11px]">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Verified & Active
                    </span>
                  ) : pay.status === 'pending_verification' ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-800 rounded-full font-bold text-[11px]">
                      <Clock className="w-3.5 h-3.5" />
                      Pending Admin Verification
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 rounded-full font-bold text-[11px]">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Rejected ({pay.rejectionReason})
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
