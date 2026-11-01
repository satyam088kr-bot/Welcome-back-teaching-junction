import React from 'react';
import {
  BookOpen,
  CheckCircle,
  Clock,
  GraduationCap,
  PlayCircle,
  Star,
  Users,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Course } from '../../types';

interface Props {
  course: Course;
  onSelect: (course: Course) => void;
}

export const CourseCard: React.FC<Props> = ({ course, onSelect }) => {
  const { currentUser, setCheckoutCourse, enrollInFreeCourse } = useApp();

  const isEnrolled = currentUser?.enrolledCourseIds.includes(course.id) || false;
  const totalLessons = course.chapters.reduce((acc, ch) => acc + ch.lessons.length, 0);

  const handleEnrollClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (course.type === 'free') {
      enrollInFreeCourse(course.id);
    } else {
      setCheckoutCourse(course);
    }
  };

  const discountPercent = course.originalPrice
    ? Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)
    : 0;

  return (
    <div
      onClick={() => onSelect(course)}
      className="group bg-white rounded-2xl border border-slate-200/90 hover:border-blue-400 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col cursor-pointer"
    >
      {/* Thumbnail area */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
          <span
            className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-sm ${
              course.type === 'free'
                ? 'bg-emerald-500 text-white'
                : 'bg-amber-500 text-slate-950 font-extrabold'
            }`}
          >
            {course.type === 'free' ? 'FREE BATCH' : 'PREMIUM'}
          </span>
          <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-slate-900/80 backdrop-blur-xs text-white">
            {course.classCategory}
          </span>
        </div>

        {/* Enrolled indicator badge if already enrolled */}
        {isEnrolled && (
          <div className="absolute top-2.5 right-2.5 bg-blue-700 text-white px-2 py-0.5 rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-sm">
            <CheckCircle className="w-3 h-3 text-amber-300" />
            <span>Enrolled</span>
          </div>
        )}

        {/* Bottom Subject Pill */}
        <div className="absolute bottom-2 left-2.5">
          <span className="px-2 py-0.5 rounded bg-blue-900/90 text-blue-100 backdrop-blur-xs text-[10px] font-semibold">
            {course.subject}
          </span>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Rating and Enrolled count */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5">
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{course.rating.toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-1 text-slate-500">
              <Users className="w-3.5 h-3.5" />
              <span>{course.enrolledCount.toLocaleString()} Students</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-bold text-sm text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-2 leading-snug">
            {course.title}
          </h3>

          {/* Description */}
          <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
            {course.description}
          </p>
        </div>

        {/* Metadata info */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="w-3 h-3 text-slate-400" />
              <span>{course.chapters.length} Ch • {totalLessons} Lectures</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
            <span className="truncate">{course.instructor}</span>
          </div>

          {/* Price & Action Row */}
          <div className="pt-2 flex items-center justify-between">
            <div>
              {course.type === 'free' ? (
                <div>
                  <span className="text-base font-black text-emerald-600">FREE</span>
                  <span className="text-[10px] text-slate-400 line-through ml-1.5">₹{course.originalPrice || 1499}</span>
                </div>
              ) : (
                <div className="flex items-baseline gap-1.5">
                  <span className="text-lg font-black text-blue-700">₹{course.price}</span>
                  {course.originalPrice && (
                    <span className="text-xs text-slate-400 line-through">₹{course.originalPrice}</span>
                  )}
                  {discountPercent > 0 && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1 rounded">
                      {discountPercent}% OFF
                    </span>
                  )}
                </div>
              )}
            </div>

            {isEnrolled ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(course);
                }}
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs rounded-xl transition"
              >
                <PlayCircle className="w-3.5 h-3.5" />
                <span>Continue</span>
              </button>
            ) : (
              <button
                onClick={handleEnrollClick}
                className={`flex items-center gap-1 px-3.5 py-1.5 rounded-xl font-bold text-xs shadow-xs transition active:scale-95 ${
                  course.type === 'free'
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                <span>{course.type === 'free' ? 'Enroll Free' : 'Enroll Now'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
