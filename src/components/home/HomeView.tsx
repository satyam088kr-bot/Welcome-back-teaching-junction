import React from 'react';
import {
  Award,
  BookOpen,
  CheckCircle,
  Clock,
  Compass,
  FileCheck,
  FileText,
  Flame,
  Globe,
  GraduationCap,
  Layers,
  Lock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  PlayCircle,
  Radio,
  Search,
  Shield,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Video,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ALL_CLASSES, ALL_SUBJECTS } from '../../data/mockData';
import { CourseCard } from '../courses/CourseCard';
import { MaterialCard } from '../materials/MaterialCard';
import { PWAInstallButton } from '../pwa/PWAInstallButton';
import { ClassCategory, Course, SubjectCategory } from '../../types';

export const HomeView: React.FC = () => {
  const {
    courses,
    materials,
    announcements,
    contactInfo,
    liveClasses,
    setSelectedClass,
    setSelectedSubject,
    setCurrentTab,
    setSelectedCourseId,
    setActivePdfMaterial,
    setAuthModalOpen,
    setApkModalOpen,
    currentUser,
  } = useApp();

  const liveNowClass = liveClasses.find((lc) => lc.status === 'live_now');
  const upcomingClasses = liveClasses.filter((lc) => lc.status === 'upcoming').slice(0, 2);
  const featuredCourses = courses.filter((c) => c.isFeatured || c.rating >= 4.9).slice(0, 3);
  const freeCourses = courses.filter((c) => c.type === 'free').slice(0, 3);
  const recentMaterials = materials.slice(0, 4);

  const handleSelectCourse = (course: Course) => {
    setSelectedCourseId(course.id);
    setCurrentTab('course_detail');
  };

  const handleClassClick = (cls: ClassCategory) => {
    setSelectedClass(cls);
    setCurrentTab('free_courses');
  };

  const handleSubjectClick = (sub: SubjectCategory) => {
    setSelectedSubject(sub);
    setCurrentTab('materials');
  };

  return (
    <div className="space-y-10 pb-16 animate-in fade-in duration-200">
      {/* Live Now Broadcast Banner (if active) */}
      {liveNowClass && (
        <section className="rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white p-4 sm:p-5 shadow-xl shadow-red-500/20 border border-red-400/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
              <Radio className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-white text-red-700 text-[10px] font-black uppercase tracking-wider animate-pulse">
                  ● LIVE NOW
                </span>
                <span className="text-xs text-white/90 font-medium">
                  {liveNowClass.classCategory} • {liveNowClass.subject}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black tracking-tight mt-0.5">
                {liveNowClass.title}
              </h2>
              <p className="text-xs text-red-100">
                Instructor: {liveNowClass.teacher} • Started at {liveNowClass.startTime}
              </p>
            </div>
          </div>

          <button
            onClick={() => setCurrentTab('live_classes')}
            className="px-5 py-2.5 rounded-xl bg-white text-red-700 hover:bg-red-50 font-black text-xs sm:text-sm shadow-md transition active:scale-95 shrink-0 flex items-center justify-center gap-2"
          >
            <span>Enter Live Class</span>
            <span className="text-xs">&rarr;</span>
          </button>
        </section>
      )}

      {/* 1. Hero Banner: Royal Blue Theme with High-End Educational Presentation */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-950 text-white shadow-2xl p-6 sm:p-10 lg:p-12 border border-blue-700/40">
        {/* Subtle Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4 sm:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-xs font-bold border border-white/15">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Teaching Junction Coaching • Session 2026-27</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.15]">
              Empowering Students for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400">
                100% Board Success
              </span>{' '}
              & Competitive Rank
            </h1>

            <p className="text-xs sm:text-base text-blue-100 max-w-xl leading-relaxed">
              Premier learning platform by <strong>{contactInfo.directorName}</strong>. NCERT foundation lectures, chapter-wise handwritten PDF notes, solved board exam questions, and structured test series for Classes 6th–12th.
            </p>

            {/* CTA Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => {
                  setSelectedClass('all');
                  setCurrentTab('free_courses');
                }}
                className="px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-400/20 transition active:scale-95 flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                <span>Explore Free Batches</span>
              </button>

              <button
                onClick={() => setCurrentTab('live_classes')}
                className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs sm:text-sm shadow-lg shadow-red-600/30 transition active:scale-95 flex items-center gap-2"
              >
                <Radio className="w-4 h-4 animate-pulse" />
                <span>Live Classes</span>
                {liveNowClass && (
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                )}
              </button>

              <button
                onClick={() => setApkModalOpen(true)}
                className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm shadow-lg shadow-emerald-600/30 transition active:scale-95 flex items-center gap-2"
              >
                <Smartphone className="w-4 h-4" />
                <span>Download Android APK</span>
              </button>

              <button
                onClick={() => setCurrentTab('materials')}
                className="px-5 py-3 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs sm:text-sm backdrop-blur-md border border-white/20 transition active:scale-95 flex items-center gap-2"
              >
                <FileText className="w-4 h-4 text-amber-300" />
                <span>Download PDF Notes</span>
              </button>

              {!currentUser && (
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="px-4 py-3 rounded-xl bg-blue-700/80 hover:bg-blue-600 text-white font-semibold text-xs transition"
                >
                  Register as Student &rarr;
                </button>
              )}
            </div>

            {/* Trust Highlights */}
            <div className="pt-4 grid grid-cols-3 gap-3 border-t border-white/15 text-[11px] sm:text-xs text-blue-200">
              <div>
                <div className="font-black text-white text-base sm:text-lg">5,000+</div>
                <div>Students Guided</div>
              </div>
              <div>
                <div className="font-black text-white text-base sm:text-lg">100% Free</div>
                <div>Foundation Notes</div>
              </div>
              <div>
                <div className="font-black text-white text-base sm:text-lg">4.9 / 5.0</div>
                <div>Student Rating</div>
              </div>
            </div>
          </div>

          {/* Right Card / Visual Showcase */}
          <div className="lg:col-span-5">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-5 sm:p-6 shadow-2xl text-white space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/15">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                    <GraduationCap className="w-6 h-6 text-amber-300" />
                  </div>
                  <div>
                    <div className="font-bold text-sm">Director's Special Desk</div>
                    <div className="text-[11px] text-blue-200">{contactInfo.directorName}</div>
                  </div>
                </div>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-400 text-slate-950">
                  Verified
                </span>
              </div>

              <blockquote className="text-xs text-blue-100 italic leading-relaxed">
                "Our single mission at Teaching Junction Coaching is to make highest-quality education accessible to every student—breaking down complex science and maths into crystal-clear concepts."
              </blockquote>

              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-blue-100 bg-white/5 p-2 rounded-xl">
                  <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Approved accounts receive 24x7 full access to protected PDF notes</span>
                </div>
                <div className="flex items-center gap-2 text-blue-100 bg-white/5 p-2 rounded-xl">
                  <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Interactive built-in PDF viewer with zoom & printable summaries</span>
                </div>
              </div>

              {/* Install PWA Prompt inside hero */}
              <div className="pt-2">
                <PWAInstallButton variant="banner" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Class Categories: 6th, 7th, 8th, 9th, 10th, 11th, 12th, Competitive Exams */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-700" />
              <span>Select Your Class or Exam</span>
            </h2>
            <p className="text-xs text-slate-500">
              Tailored curriculum, NCERT solutions, and target question banks for each grade.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 sm:gap-3">
          {ALL_CLASSES.map((cls, idx) => (
            <button
              key={cls}
              onClick={() => handleClassClick(cls)}
              className="group p-3 sm:p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-500 shadow-2xs hover:shadow-md transition text-center flex flex-col items-center justify-center gap-1.5 active:scale-95"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 group-hover:bg-blue-600 text-blue-700 group-hover:text-white transition flex items-center justify-center font-black text-xs">
                {idx === 7 ? 'GOV' : `${6 + idx}`}
              </div>
              <span className="font-bold text-xs text-slate-800 group-hover:text-blue-700 transition leading-tight">
                {cls}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* 3. Subject Categories: Science, Math, Social Science, History, Geo, Civics, Economics, Hindi, English */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-700" />
              <span>Study by Subjects</span>
            </h2>
            <p className="text-xs text-slate-500">
              Browse handwritten lecture notes, formula sheets, and chapter summaries.
            </p>
          </div>
          <button
            onClick={() => setCurrentTab('materials')}
            className="text-xs font-bold text-blue-700 hover:text-blue-800 hover:underline"
          >
            All Subjects &rarr;
          </button>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-9 gap-2 sm:gap-3">
          {ALL_SUBJECTS.map((sub) => (
            <button
              key={sub}
              onClick={() => handleSubjectClick(sub)}
              className="p-3 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-500 shadow-2xs hover:shadow-md transition text-center flex flex-col items-center justify-center gap-1 active:scale-95 group"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 group-hover:bg-indigo-600 group-hover:text-white transition flex items-center justify-center">
                <FileCheck className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold text-slate-700 group-hover:text-blue-700 truncate w-full">
                {sub}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* 4. Featured Courses Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
                Top Rated
              </span>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                Featured Batches & Complete Courses
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Comprehensive preparation with video lectures, assignments, and test series.
            </p>
          </div>
          <button
            onClick={() => setCurrentTab('paid_courses')}
            className="text-xs font-bold text-blue-700 hover:text-blue-800 hover:underline"
          >
            View All Courses &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredCourses.map((c) => (
            <CourseCard key={c.id} course={c} onSelect={handleSelectCourse} />
          ))}
        </div>
      </section>

      {/* 5. 100% Free Foundation Courses Section */}
      <section className="bg-gradient-to-br from-blue-50/70 to-indigo-50/60 rounded-3xl p-6 sm:p-8 border border-blue-100 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider mb-1">
              <Zap className="w-3 h-3" />
              <span>100% Free Access</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              Free Foundation Courses (NCERT Lectures)
            </h2>
            <p className="text-xs text-slate-600">
              Start watching without paying a single rupee. Open to all registered & approved students.
            </p>
          </div>
          <button
            onClick={() => setCurrentTab('free_courses')}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
          >
            Explore Free Batches
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {freeCourses.map((c) => (
            <CourseCard key={c.id} course={c} onSelect={handleSelectCourse} />
          ))}
        </div>
      </section>

      {/* 6. Latest Downloadable PDF Notes (Study Materials) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-700" />
              <span>Latest Study Materials & Handwritten PDF Notes</span>
            </h2>
            <p className="text-xs text-slate-500">
              Read online with our interactive reader or download for offline revision.
            </p>
          </div>
          <button
            onClick={() => setCurrentTab('materials')}
            className="text-xs font-bold text-blue-700 hover:text-blue-800 hover:underline"
          >
            All Materials ({materials.length}) &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {recentMaterials.map((mat) => (
            <MaterialCard
              key={mat.id}
              material={mat}
              onView={(m) => setActivePdfMaterial(m)}
            />
          ))}
        </div>
      </section>

      {/* 7. Why Teaching Junction Coaching */}
      <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-sm space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <span className="text-xs font-black uppercase tracking-wider text-blue-700">
            Why Teaching Junction?
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            The Smartest Way To Prepare For Board Exams
          </h2>
          <p className="text-xs text-slate-500">
            Engineered by dedicated educators with a focus on simplicity, retention, and maximum score.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
              <GraduationCap className="w-5 h-5 text-amber-300" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">Expert Faculty</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Led by Er. Satyam Kumar with over 8 years of proven teaching experience and hundreds of board toppers.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
              <FileCheck className="w-5 h-5 text-amber-300" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">Handwritten PDF Notes</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Curated chapter-wise golden notes, formula handbooks, and step-by-step derivation blueprints.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
              <Award className="w-5 h-5 text-amber-300" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">10-Year Solved PYQs</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Thorough past board paper analysis with official marking scheme breakdowns to maximize marks.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-100 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">Verified Enrollment</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Strict student verification ensuring safe, distraction-free, and dedicated peer-learning atmosphere.
            </p>
          </div>
        </div>
      </section>

      {/* 8. Quick Contact & Offline Coaching Center Information */}
      <section className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl border border-blue-700/50">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold border border-white/15">
              <Phone className="w-3.5 h-3.5" />
              <span>Direct Coaching Support & Admissions</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              Visit Teaching Junction Campus or Contact Us
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
              Have doubts regarding batch timings, board exam syllabus, or admission approval? Er. {contactInfo.directorName} and the counseling team are here to assist you.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
              <div className="flex items-center gap-2.5 bg-white/10 p-2.5 rounded-xl border border-white/10">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="truncate">{contactInfo.address}</span>
              </div>
              <div className="flex items-center gap-2.5 bg-white/10 p-2.5 rounded-xl border border-white/10">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Call: {contactInfo.phone}</span>
              </div>
              <div className="flex items-center gap-2.5 bg-white/10 p-2.5 rounded-xl border border-white/10">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>WhatsApp: {contactInfo.whatsapp}</span>
              </div>
              <div className="flex items-center gap-2.5 bg-white/10 p-2.5 rounded-xl border border-white/10">
                <Mail className="w-4 h-4 text-blue-300 shrink-0" />
                <span className="truncate">{contactInfo.email}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
            <a
              href={`https://wa.me/${contactInfo.whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20Teaching%20Junction%20Coaching,%20I%20have%20an%20inquiry%20regarding%20admission`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition active:scale-95 text-center flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
            </a>

            <button
              onClick={() => setCurrentTab('contact')}
              className="px-5 py-3 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs sm:text-sm border border-white/25 transition active:scale-95 text-center flex items-center justify-center gap-2"
            >
              <Mail className="w-4 h-4 text-amber-300" />
              <span>Open Contact & Admission Form</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
