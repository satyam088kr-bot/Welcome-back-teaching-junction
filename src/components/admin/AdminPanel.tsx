import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  BookOpen,
  Check,
  CheckCircle,
  Clock,
  CreditCard,
  FileText,
  FileUp,
  Globe,
  GraduationCap,
  Layers,
  Lock,
  Mail,
  MapPin,
  Megaphone,
  MessageCircle,
  Phone,
  Plus,
  Radio,
  RefreshCw,
  Save,
  Search,
  Shield,
  ShieldAlert,
  Sparkles,
  Trash2,
  Upload,
  UserCheck,
  UserX,
  Users,
  Video,
  X,
  Youtube,
  Edit,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UploadNotesTab } from './UploadNotesTab';
import { ManageNotesTab } from './ManageNotesTab';
import { ALL_CLASSES, ALL_SUBJECTS } from '../../data/mockData';
import {
  AccountStatus,
  Announcement,
  ClassCategory,
  ContactInfo,
  Course,
  LiveClass,
  LiveClassStatus,
  MaterialType,
  MeetingPlatform,
  PaymentRecord,
  Role,
  StudyMaterial,
  SubjectCategory,
} from '../../types';

export const AdminPanel: React.FC = () => {
  const {
    currentUser,
    loginAsUser,
    allUsers,
    approveStudent,
    rejectStudent,
    suspendStudent,
    reactivateStudent,
    updateUserRole,
    deleteUser,
    courses,
    addCourse,
    updateCourse,
    deleteCourse,
    materials,
    addMaterial,
    deleteMaterial,
    setActivePdfMaterial,
    payments,
    verifyPayment,
    rejectPayment,
    announcements,
    addAnnouncement,
    deleteAnnouncement,
    contactInfo,
    updateContactInfo,
    liveClasses,
    addLiveClass,
    updateLiveClass,
    deleteLiveClass,
    startLiveClass,
    endLiveClass,
    resetAllData,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<
    | 'dashboard'
    | 'upload_notes'
    | 'manage_notes'
    | 'students'
    | 'courses'
    | 'live_classes'
    | 'materials'
    | 'payments'
    | 'announcements'
    | 'contact'
  >('dashboard');

  // Student filter
  const [studentStatusFilter, setStudentStatusFilter] = useState<AccountStatus | 'all'>('all');
  const [studentSearch, setStudentSearch] = useState('');

  // Course Modal state
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [courseTitle, setCourseTitle] = useState('');
  const [courseClass, setCourseClass] = useState<ClassCategory>('Class 10th');
  const [courseSubject, setCourseSubject] = useState<SubjectCategory>('Science');
  const [courseType, setCourseType] = useState<'free' | 'paid'>('free');
  const [coursePrice, setCoursePrice] = useState(0);
  const [courseOriginalPrice, setCourseOriginalPrice] = useState(1499);
  const [courseThumbnail, setCourseThumbnail] = useState(
    'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&auto=format&fit=crop&q=80'
  );
  const [courseInstructor, setCourseInstructor] = useState('Er. Satyam Kumar (Director)');
  const [courseDescription, setCourseDescription] = useState('');
  const [courseDuration, setCourseDuration] = useState('45 Hours | 30 Lectures');

  // Study Material Modal state
  const [materialModalOpen, setMaterialModalOpen] = useState(false);
  const [matTitle, setMatTitle] = useState('');
  const [matClass, setMatClass] = useState<ClassCategory>('Class 10th');
  const [matSubject, setMatSubject] = useState<SubjectCategory>('Science');
  const [matChapter, setMatChapter] = useState('');
  const [matType, setMatType] = useState<MaterialType>('handwritten_notes');
  const [matPages, setMatPages] = useState(12);
  const [matFileSize, setMatFileSize] = useState('3.5 MB');
  const [matIsProtected, setMatIsProtected] = useState(true);
  const [matContent, setMatContent] = useState('');

  // Announcement Modal state
  const [annModalOpen, setAnnModalOpen] = useState(false);
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annCategory, setAnnCategory] = useState<'batch' | 'exam' | 'holiday' | 'general'>('general');
  const [annUrgent, setAnnUrgent] = useState(false);

  // Live Class Modal State
  const [liveModalOpen, setLiveModalOpen] = useState(false);
  const [editingLiveId, setEditingLiveId] = useState<string | null>(null);
  const [liveTitle, setLiveTitle] = useState('');
  const [liveClass, setLiveClass] = useState<ClassCategory>('Class 10th');
  const [liveSubject, setLiveSubject] = useState<SubjectCategory>('Science');
  const [liveTeacher, setLiveTeacher] = useState('Er. Satyam Kumar (Director)');
  const [liveDate, setLiveDate] = useState('Today');
  const [liveStartTime, setLiveStartTime] = useState('18:00 IST');
  const [liveDuration, setLiveDuration] = useState('60 mins');
  const [liveDescription, setLiveDescription] = useState('');
  const [liveMeetingUrl, setLiveMeetingUrl] = useState('https://meet.google.com/abc-defg-hij');
  const [livePlatform, setLivePlatform] = useState<MeetingPlatform>('google_meet');
  const [liveStatus, setLiveStatus] = useState<LiveClassStatus>('upcoming');

  // Contact Settings Form State
  const [contactFormPhone, setContactFormPhone] = useState(contactInfo.phone);
  const [contactFormWhatsapp, setContactFormWhatsapp] = useState(contactInfo.whatsapp);
  const [contactFormEmail, setContactFormEmail] = useState(contactInfo.email);
  const [contactFormAddress, setContactFormAddress] = useState(contactInfo.address);
  const [contactFormWebsite, setContactFormWebsite] = useState(contactInfo.website);
  const [contactFormHours, setContactFormHours] = useState(contactInfo.officeHours);
  const [contactFormDirector, setContactFormDirector] = useState(contactInfo.directorName);
  const [contactSaving, setContactSaving] = useState(false);

  // Sync contact form when context changes
  useEffect(() => {
    setContactFormPhone(contactInfo.phone);
    setContactFormWhatsapp(contactInfo.whatsapp);
    setContactFormEmail(contactInfo.email);
    setContactFormAddress(contactInfo.address);
    setContactFormWebsite(contactInfo.website);
    setContactFormHours(contactInfo.officeHours);
    setContactFormDirector(contactInfo.directorName);
  }, [contactInfo]);

  const handleSaveContactSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSaving(true);
    const success = updateContactInfo({
      phone: contactFormPhone.trim(),
      whatsapp: contactFormWhatsapp.trim(),
      email: contactFormEmail.trim(),
      address: contactFormAddress.trim(),
      website: contactFormWebsite.trim(),
      officeHours: contactFormHours.trim(),
      directorName: contactFormDirector.trim(),
    });
    setContactSaving(false);
  };

  const handleSaveLiveClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!liveTitle.trim() || !liveMeetingUrl.trim()) return;

    // Detect platform automatically if needed
    let detectedPlatform = livePlatform;
    if (liveMeetingUrl.includes('meet.google.com')) {
      detectedPlatform = 'google_meet';
    } else if (liveMeetingUrl.includes('youtube') || liveMeetingUrl.includes('youtu.be')) {
      detectedPlatform = 'youtube_live';
    }

    if (editingLiveId) {
      updateLiveClass(editingLiveId, {
        title: liveTitle.trim(),
        classCategory: liveClass,
        subject: liveSubject,
        teacher: liveTeacher.trim(),
        date: liveDate.trim(),
        startTime: liveStartTime.trim(),
        duration: liveDuration.trim(),
        description: liveDescription.trim(),
        meetingUrl: liveMeetingUrl.trim(),
        platform: detectedPlatform,
        status: liveStatus,
      });
    } else {
      addLiveClass({
        title: liveTitle.trim(),
        classCategory: liveClass,
        subject: liveSubject,
        teacher: liveTeacher.trim(),
        date: liveDate.trim(),
        startTime: liveStartTime.trim(),
        duration: liveDuration.trim(),
        description: liveDescription.trim(),
        meetingUrl: liveMeetingUrl.trim(),
        platform: detectedPlatform,
        status: liveStatus,
        isFreeForApprovedStudents: true,
      });
    }

    setLiveModalOpen(false);
    setEditingLiveId(null);
  };

  const openNewLiveClassModal = () => {
    setEditingLiveId(null);
    setLiveTitle('');
    setLiveClass('Class 10th');
    setLiveSubject('Science');
    setLiveTeacher('Er. Satyam Kumar (Director)');
    setLiveDate('Today');
    setLiveStartTime('18:00 IST');
    setLiveDuration('60 mins');
    setLiveDescription('Important board exam topic revision and live student doubt solving.');
    setLiveMeetingUrl('https://meet.google.com/abc-defg-hij');
    setLivePlatform('google_meet');
    setLiveStatus('upcoming');
    setLiveModalOpen(true);
  };

  const openEditLiveClassModal = (lc: LiveClass) => {
    setEditingLiveId(lc.id);
    setLiveTitle(lc.title);
    setLiveClass(lc.classCategory);
    setLiveSubject(lc.subject);
    setLiveTeacher(lc.teacher);
    setLiveDate(lc.date);
    setLiveStartTime(lc.startTime);
    setLiveDuration(lc.duration);
    setLiveDescription(lc.description);
    setLiveMeetingUrl(lc.meetingUrl);
    setLivePlatform(lc.platform);
    setLiveStatus(lc.status);
    setLiveModalOpen(true);
  };

  // Security Gate: Ensure only Admin can see this
  if (currentUser?.role !== 'admin') {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center max-w-lg mx-auto my-12 space-y-4 shadow-xl">
        <div className="w-16 h-16 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Restricted Administration Zone</h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          Access to student management, course creation, study material publishing, and payment verification is strictly reserved for Teaching Junction Coaching administrators.
        </p>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-left text-xs text-blue-900 space-y-2">
          <div className="font-bold flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-blue-700" />
            <span>Coaching Owner Verification</span>
          </div>
          <div>Master Admin: <strong>satyam088kr@gmail.com</strong></div>
          <button
            onClick={() => loginAsUser('user-admin-1')}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition"
          >
            Authenticate as Director (Satyam Kumar)
          </button>
        </div>
      </div>
    );
  }

  // Dashboard calculations
  const totalStudents = allUsers.filter((u) => u.role === 'student').length;
  const pendingStudents = allUsers.filter((u) => u.role === 'student' && u.status === 'pending');
  const approvedStudents = allUsers.filter((u) => u.role === 'student' && u.status === 'approved');
  const pendingPayments = payments.filter((p) => p.status === 'pending_verification');

  // Filter students
  const filteredStudents = allUsers
    .filter((u) => u.role === 'student')
    .filter((u) => {
      if (studentStatusFilter !== 'all' && u.status !== studentStatusFilter) return false;
      if (studentSearch.trim()) {
        const q = studentSearch.toLowerCase();
        return (
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.phone.includes(q) ||
          u.assignedClass.toLowerCase().includes(q)
        );
      }
      return true;
    });

  // Handle Create or Edit Course
  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseTitle.trim()) return;

    if (editingCourseId) {
      updateCourse(editingCourseId, {
        title: courseTitle,
        classCategory: courseClass,
        subject: courseSubject,
        type: courseType,
        price: courseType === 'free' ? 0 : Number(coursePrice),
        originalPrice: Number(courseOriginalPrice),
        thumbnail: courseThumbnail,
        instructor: courseInstructor,
        description: courseDescription,
        duration: courseDuration,
      });
    } else {
      addCourse({
        title: courseTitle,
        classCategory: courseClass,
        subject: courseSubject,
        type: courseType,
        price: courseType === 'free' ? 0 : Number(coursePrice),
        originalPrice: Number(courseOriginalPrice),
        thumbnail: courseThumbnail,
        instructor: courseInstructor,
        description: courseDescription,
        duration: courseDuration,
        language: 'Hindi & English (Hinglish)',
        rating: 5.0,
        enrolledCount: 0,
        isFeatured: false,
        chapters: [
          {
            id: 'ch-' + Date.now(),
            title: 'Chapter 1: Foundational Core Concepts',
            order: 1,
            lessons: [
              {
                id: 'les-' + Date.now(),
                title: '1.1 Introduction & Syllabus Blueprint',
                duration: '25 mins',
                pdfTitle: 'Chapter 1 Lecture Notes (PDF)',
                pdfNoteUrl: '/mock/lecture_notes.pdf',
                isFreePreview: true,
                summary: 'Introductory classroom concept breakdown and practice questions.',
              },
            ],
          },
        ],
      });
    }

    setCourseModalOpen(false);
    setEditingCourseId(null);
  };

  const openNewCourseModal = () => {
    setEditingCourseId(null);
    setCourseTitle('');
    setCoursePrice(999);
    setCourseOriginalPrice(2499);
    setCourseType('paid');
    setCourseDescription('In-depth syllabus preparation with solved assignments and notes.');
    setCourseModalOpen(true);
  };

  const openEditCourseModal = (course: Course) => {
    setEditingCourseId(course.id);
    setCourseTitle(course.title);
    setCourseClass(course.classCategory);
    setCourseSubject(course.subject);
    setCourseType(course.type);
    setCoursePrice(course.price);
    setCourseOriginalPrice(course.originalPrice || 1499);
    setCourseThumbnail(course.thumbnail);
    setCourseInstructor(course.instructor);
    setCourseDescription(course.description);
    setCourseDuration(course.duration);
    setCourseModalOpen(true);
  };

  // Handle Save Material
  const handleSaveMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!matTitle.trim() || !matChapter.trim()) return;

    addMaterial({
      title: matTitle.trim(),
      description: `Official study guide for ${matClass} - ${matSubject} (${matChapter})`,
      classCategory: matClass,
      subject: matSubject,
      chapterName: matChapter.trim(),
      fileUrl: '/mock/uploaded_document.pdf',
      fileSize: matFileSize,
      pageCount: Number(matPages) || 10,
      type: matType,
      isProtected: matIsProtected,
      contentPreview: matContent.trim() || `TEACHING JUNCTION COACHING - ${matTitle}\nClass: ${matClass} | Subject: ${matSubject}\nChapter: ${matChapter}\n\nKey Concepts and Solved Examples verified by academic director.`,
    });

    setMaterialModalOpen(false);
    setMatTitle('');
    setMatChapter('');
    setMatContent('');
  };

  // Handle Publish Announcement
  const handlePublishAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annContent.trim()) return;

    addAnnouncement({
      title: annTitle.trim(),
      content: annContent.trim(),
      category: annCategory,
      urgent: annUrgent,
      date: new Date().toISOString().split('T')[0],
      author: 'Director Office',
    });

    setAnnModalOpen(false);
    setAnnTitle('');
    setAnnContent('');
  };

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-200">
      {/* Top Admin Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">
              Administration Portal
            </span>
            <span className="text-xs text-blue-300 font-mono">
              Signed in as {currentUser.email}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            Teaching Junction Coaching Management
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Live database controls for student account approval, course creation, PDF study material uploading, and manual fee payment verification.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={resetAllData}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition"
            title="Reset database to initial demo state"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo DB</span>
          </button>
        </div>
      </div>

      {/* Navigation Subtabs */}
      {/* Sub-navigation Tabs */}
      <div className="bg-white rounded-2xl p-1.5 border border-slate-200/90 shadow-xs flex items-center gap-1 overflow-x-auto scrollbar-none text-xs font-bold">
        <button
          onClick={() => setActiveSubTab('dashboard')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition shrink-0 ${
            activeSubTab === 'dashboard'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => setActiveSubTab('upload_notes')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition shrink-0 ${
            activeSubTab === 'upload_notes'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
          }`}
        >
          <FileUp className="w-4 h-4 text-blue-600" />
          <span>Upload Notes</span>
          <Plus className="w-3 h-3 text-blue-500" />
        </button>

        <button
          onClick={() => setActiveSubTab('manage_notes')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition shrink-0 ${
            activeSubTab === 'manage_notes' || activeSubTab === 'materials'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Manage Notes ({materials.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('students')}
          className={`relative flex items-center gap-2 px-4 py-2 rounded-xl transition shrink-0 ${
            activeSubTab === 'students'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Manage Students</span>
          {pendingStudents.length > 0 && (
            <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] flex items-center justify-center">
              {pendingStudents.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('courses')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition shrink-0 ${
            activeSubTab === 'courses'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Courses ({courses.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('live_classes')}
          className={`relative flex items-center gap-2 px-4 py-2 rounded-xl transition shrink-0 ${
            activeSubTab === 'live_classes'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Radio className="w-4 h-4 text-red-500" />
          <span>Live Classes ({liveClasses.length})</span>
          {liveClasses.some((c) => c.status === 'live_now') && (
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('payments')}
          className={`relative flex items-center gap-2 px-4 py-2 rounded-xl transition shrink-0 ${
            activeSubTab === 'payments'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Payment Verifications</span>
          {pendingPayments.length > 0 && (
            <span className="w-5 h-5 rounded-full bg-emerald-500 text-white font-black text-[10px] flex items-center justify-center">
              {pendingPayments.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('announcements')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition shrink-0 ${
            activeSubTab === 'announcements'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Megaphone className="w-4 h-4" />
          <span>Notices ({announcements.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('contact')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition shrink-0 ${
            activeSubTab === 'contact'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Phone className="w-4 h-4" />
          <span>Contact Settings</span>
        </button>
      </div>

      {/* SUBTAB 1: DASHBOARD OVERVIEW */}
      {activeSubTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Real Functional Stat Cards (Total Students, Pending Students, Approved Students, Total Uploaded Notes) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Total Students */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider">Total Students</span>
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">{totalStudents}</div>
              <button
                onClick={() => setActiveSubTab('students')}
                className="text-[11px] text-blue-600 font-bold hover:underline block"
              >
                Manage All Accounts &rarr;
              </button>
            </div>

            {/* 2. Pending Students */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-amber-200 shadow-sm space-y-2 bg-gradient-to-br from-white to-amber-50/40">
              <div className="flex items-center justify-between text-amber-700">
                <span className="text-xs font-bold uppercase tracking-wider">Pending Students</span>
                <ShieldAlert className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-amber-900">{pendingStudents.length}</div>
              <button
                onClick={() => setActiveSubTab('students')}
                className="text-[11px] text-amber-800 font-bold hover:underline block"
              >
                Review & Approve &rarr;
              </button>
            </div>

            {/* 3. Approved Students */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-emerald-200 shadow-sm space-y-2 bg-gradient-to-br from-white to-emerald-50/40">
              <div className="flex items-center justify-between text-emerald-700">
                <span className="text-xs font-bold uppercase tracking-wider">Approved Students</span>
                <UserCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-900">{approvedStudents.length}</div>
              <div className="text-[11px] text-emerald-700 font-medium">
                Active access granted to notes
              </div>
            </div>

            {/* 4. Total Uploaded Notes */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-blue-200 shadow-sm space-y-2 bg-gradient-to-br from-white to-blue-50/40">
              <div className="flex items-center justify-between text-blue-700">
                <span className="text-xs font-bold uppercase tracking-wider">Total Uploaded Notes</span>
                <FileText className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-blue-900">{materials.length}</div>
              <button
                onClick={() => setActiveSubTab('manage_notes')}
                className="text-[11px] text-blue-700 font-bold hover:underline block"
              >
                Browse Study Materials &rarr;
              </button>
            </div>
          </div>

          {/* Dedicated Quick Action Command Bar (Upload Notes, Manage Notes, Manage Students) */}
          <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-6 text-white shadow-md">
            <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
              <div>
                <span className="text-amber-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Administrative Control Center</span>
                </span>
                <h3 className="text-lg font-black text-white mt-0.5">Quick Operational Actions</h3>
              </div>
              <span className="text-xs text-slate-400">
                Direct single-click access to all primary management workflows
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Button 1: Upload Notes */}
              <button
                type="button"
                onClick={() => setActiveSubTab('upload_notes')}
                className="p-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-left transition shadow-sm group flex items-start gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-white/10 group-hover:bg-white/20 flex items-center justify-center shrink-0">
                  <FileUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-bold text-sm text-white flex items-center gap-1">
                    <span>Upload Notes</span>
                    <Plus className="w-3.5 h-3.5 text-amber-300" />
                  </div>
                  <div className="text-xs text-blue-200 mt-0.5">
                    Upload PDF, DOC, XLS, PPT to Cloud Storage
                  </div>
                </div>
              </button>

              {/* Button 2: Manage Notes */}
              <button
                type="button"
                onClick={() => setActiveSubTab('manage_notes')}
                className="p-4 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-left transition shadow-sm group flex items-start gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-white/10 group-hover:bg-white/20 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-bold text-sm text-white">Manage Notes</div>
                  <div className="text-xs text-slate-300 mt-0.5">
                    Edit, replace file, preview and delete {materials.length} notes
                  </div>
                </div>
              </button>

              {/* Button 3: Manage Students */}
              <button
                type="button"
                onClick={() => setActiveSubTab('students')}
                className="p-4 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-left transition shadow-sm group flex items-start gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-white/10 group-hover:bg-white/20 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-bold text-sm text-white flex items-center gap-1.5">
                    <span>Manage Students</span>
                    {pendingStudents.length > 0 && (
                      <span className="bg-amber-400 text-slate-950 font-black text-[10px] px-1.5 py-0.2 rounded-full">
                        {pendingStudents.length}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-300 mt-0.5">
                    Approve, reject, or suspend student access
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Quick Pending Actions Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Urgent Pending Student Approvals */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-500" />
                  <span>Pending Student Approvals ({pendingStudents.length})</span>
                </h3>
                <button
                  onClick={() => setActiveSubTab('students')}
                  className="text-xs font-semibold text-blue-600 hover:underline"
                >
                  View All
                </button>
              </div>

              {pendingStudents.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {pendingStudents.slice(0, 3).map((student) => (
                    <div key={student.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="font-bold text-slate-900">{student.name}</div>
                        <div className="text-slate-500 text-[11px]">
                          {student.email} • {student.assignedClass}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => approveStudent(student.id)}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => rejectStudent(student.id, 'Information incomplete')}
                          className="px-2 py-1 text-red-600 hover:bg-red-50 rounded-lg text-xs font-medium"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-slate-500 p-6 text-center bg-slate-50 rounded-xl">
                  No pending student accounts. All registrations are approved!
                </div>
              )}
            </div>

            {/* Pending Fee Verifications */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  <span>Pending Payment Submissions ({pendingPayments.length})</span>
                </h3>
                <button
                  onClick={() => setActiveSubTab('payments')}
                  className="text-xs font-semibold text-blue-600 hover:underline"
                >
                  Manage Desk
                </button>
              </div>

              {pendingPayments.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {pendingPayments.slice(0, 3).map((p) => (
                    <div key={p.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="font-bold text-slate-900">{p.studentName}</div>
                        <div className="text-slate-500 text-[11px] truncate max-w-xs">
                          {p.courseTitle} • <strong className="text-blue-700">₹{p.amount}</strong>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">UTR: {p.transactionId}</div>
                      </div>
                      <button
                        onClick={() => verifyPayment(p.id)}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition shrink-0"
                      >
                        Verify & Grant
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-slate-500 p-6 text-center bg-slate-50 rounded-xl">
                  All course payments are verified up to date.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: STUDENT MANAGEMENT & APPROVALS */}
      {activeSubTab === 'students' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden space-y-4 p-5">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Student Account Management</h2>
              <p className="text-xs text-slate-500">
                Rule: Every new student account stays PENDING until approved. Only approved students access protected materials.
              </p>
            </div>

            {/* Status Filter Tabs */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              {(['all', 'pending', 'approved', 'suspended', 'rejected'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStudentStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg capitalize transition ${
                    studentStatusFilter === st
                      ? 'bg-white text-slate-900 font-bold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Student Search */}
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Filter by name, email, phone or class..."
              value={studentSearch}
              onChange={(e) => setStudentSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Students Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-3">Student Name</th>
                  <th className="py-3 px-3">Contact Details</th>
                  <th className="py-3 px-3">Target Class</th>
                  <th className="py-3 px-3">Account Status</th>
                  <th className="py-3 px-3">Enrolled</th>
                  <th className="py-3 px-3 text-right">Administrative Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-3 font-semibold text-slate-900">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <div>{student.name}</div>
                          <div className="text-[10px] text-slate-400 font-normal">
                            Joined {new Date(student.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-slate-600">
                      <div className="font-mono text-[11px]">{student.email}</div>
                      <div className="text-slate-400 text-[10px]">{student.phone}</div>
                    </td>

                    <td className="py-3 px-3 font-medium text-slate-800">
                      <span className="bg-blue-50 text-blue-800 font-bold px-2 py-0.5 rounded">
                        {student.assignedClass}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          student.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : student.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : student.status === 'suspended'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {student.status.toUpperCase()}
                      </span>
                      {student.rejectionReason && (
                        <div className="text-[10px] text-red-600 mt-0.5 max-w-xs truncate">
                          Reason: {student.rejectionReason}
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-3 font-semibold text-slate-700">
                      {student.enrolledCourseIds.length} Courses
                    </td>

                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {student.status === 'pending' && (
                          <>
                            <button
                              onClick={() => approveStudent(student.id)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition"
                              title="Approve Student Account"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => rejectStudent(student.id, 'Invalid admission details')}
                              className="px-2 py-1 bg-red-50 text-red-700 hover:bg-red-100 font-semibold rounded-lg transition"
                              title="Reject Account"
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {student.status === 'approved' && (
                          <button
                            onClick={() => suspendStudent(student.id)}
                            className="px-2 py-1 bg-amber-50 text-amber-800 hover:bg-amber-100 font-medium rounded-lg"
                            title="Suspend Student Access"
                          >
                            Suspend
                          </button>
                        )}

                        {student.status === 'suspended' && (
                          <button
                            onClick={() => reactivateStudent(student.id)}
                            className="px-2 py-1 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-bold rounded-lg"
                          >
                            Reactivate
                          </button>
                        )}

                        {student.status === 'rejected' && (
                          <button
                            onClick={() => approveStudent(student.id)}
                            className="px-2 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold rounded-lg"
                          >
                            Re-Approve
                          </button>
                        )}

                        <button
                          onClick={() => deleteUser(student.id)}
                          className="p-1 text-slate-400 hover:text-red-600 rounded-lg"
                          title="Delete Student Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 3: COURSE MANAGEMENT */}
      {activeSubTab === 'courses' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div>
              <h2 className="text-base font-bold text-slate-900">Coaching Courses & Batches</h2>
              <p className="text-xs text-slate-500">
                Create new course batches, configure Free/Paid pricing, add chapters, and attach lecture PDF notes.
              </p>
            </div>
            <button
              onClick={openNewCourseModal}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Course</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-video w-full bg-slate-100">
                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2 flex gap-1">
                      <span className="bg-slate-900/80 text-white px-2 py-0.5 rounded text-[10px] font-bold">
                        {course.classCategory}
                      </span>
                      <span className="bg-blue-700 text-white px-2 py-0.5 rounded text-[10px] font-bold">
                        {course.subject}
                      </span>
                    </div>
                    <div className="absolute top-2 right-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          course.type === 'free' ? 'bg-emerald-600 text-white' : 'bg-amber-400 text-slate-950'
                        }`}
                      >
                        {course.type === 'free' ? 'FREE' : `PAID ₹${course.price}`}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <h3 className="font-bold text-sm text-slate-900 line-clamp-2 leading-snug">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2">{course.description}</p>
                    <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                      <span>{course.chapters.length} Chapters</span>
                      <span>{course.enrolledCount} Enrolled</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between gap-2 mt-2">
                  <button
                    onClick={() => openEditCourseModal(course)}
                    className="flex-1 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-lg flex items-center justify-center gap-1 transition"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit Course</span>
                  </button>
                  <button
                    onClick={() => deleteCourse(course.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Delete Course"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB: UPLOAD NOTES SYSTEM */}
      {activeSubTab === 'upload_notes' && (
        <UploadNotesTab
          onSuccess={() => setActiveSubTab('manage_notes')}
          onViewNote={(m) => setActivePdfMaterial(m)}
        />
      )}

      {/* SUBTAB: MANAGE NOTES */}
      {(activeSubTab === 'manage_notes' || activeSubTab === 'materials') && (
        <ManageNotesTab
          onNavigateToUpload={() => setActiveSubTab('upload_notes')}
          onViewNote={(m) => setActivePdfMaterial(m)}
        />
      )}

      {/* SUBTAB 5: PAYMENT VERIFICATIONS */}
      {activeSubTab === 'payments' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Course Payment & Enrollment Desk</h2>
            <p className="text-xs text-slate-500">
              Review UPI/UTR reference submissions. Click "Verify & Grant Access" to instantly enroll the student into the course.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-3">Student Name</th>
                  <th className="py-3 px-3">Course Title</th>
                  <th className="py-3 px-3">Amount</th>
                  <th className="py-3 px-3">12-Digit UTR / Ref</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-3 font-semibold text-slate-900">
                      <div>{p.studentName}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{p.studentEmail}</div>
                    </td>

                    <td className="py-3 px-3 text-slate-700 font-medium max-w-xs truncate">
                      {p.courseTitle}
                    </td>

                    <td className="py-3 px-3 font-black text-blue-700">₹{p.amount}</td>

                    <td className="py-3 px-3 font-mono font-bold text-slate-900">
                      <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {p.transactionId}
                      </span>
                      {p.notes && <div className="text-[10px] text-slate-400 font-sans mt-0.5">{p.notes}</div>}
                    </td>

                    <td className="py-3 px-3 text-slate-500">
                      {new Date(p.submittedAt).toLocaleDateString()}
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          p.status === 'verified'
                            ? 'bg-emerald-100 text-emerald-800'
                            : p.status === 'pending_verification'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {p.status === 'verified'
                          ? 'VERIFIED'
                          : p.status === 'pending_verification'
                          ? 'PENDING'
                          : 'REJECTED'}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right">
                      {p.status === 'pending_verification' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => verifyPayment(p.id)}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition"
                          >
                            Verify & Grant
                          </button>
                          <button
                            onClick={() => rejectPayment(p.id, 'UTR not found in bank statement')}
                            className="px-2 py-1 bg-red-50 text-red-700 hover:bg-red-100 font-medium rounded-lg"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">Completed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 6: ANNOUNCEMENTS MANAGEMENT */}
      {activeSubTab === 'announcements' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div>
              <h2 className="text-base font-bold text-slate-900">Coaching Notices & Circulars</h2>
              <p className="text-xs text-slate-500">
                Publish exam dates, holiday schedules, and batch admission announcements to student homepages.
              </p>
            </div>
            <button
              onClick={() => setAnnModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              <span>Post New Notice</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {announcements.map((ann) => (
              <div
                key={ann.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md">
                      {ann.category}
                    </span>
                    {ann.urgent && (
                      <span className="text-[10px] font-bold bg-amber-400 text-slate-950 px-2 py-0.5 rounded-md">
                        URGENT
                      </span>
                    )}
                    <span className="text-[11px] text-slate-400 ml-auto">{ann.date}</span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-900">{ann.title}</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{ann.content}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span>Author: {ann.author}</span>
                  <button
                    onClick={() => deleteAnnouncement(ann.id)}
                    className="p-1 text-slate-400 hover:text-red-600 rounded-lg"
                    title="Delete Notice"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 7: LIVE CLASSES MANAGEMENT */}
      {activeSubTab === 'live_classes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Radio className="w-4 h-4 text-red-600 animate-pulse" />
                <span>Live Interactive Classrooms</span>
              </h2>
              <p className="text-xs text-slate-500">
                Schedule and broadcast live interactive lecture sessions via official Google Meet and YouTube Live links.
              </p>
            </div>
            <button
              onClick={openNewLiveClassModal}
              className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule Live Class</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-3">Class Title & Topic</th>
                    <th className="py-3 px-3">Grade & Subject</th>
                    <th className="py-3 px-3">Faculty / Teacher</th>
                    <th className="py-3 px-3">Scheduled Timing</th>
                    <th className="py-3 px-3">Platform & Link</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Classroom Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {liveClasses.map((lc) => (
                    <tr key={lc.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-3 font-semibold text-slate-900 max-w-xs">
                        <div className="truncate">{lc.title}</div>
                        <div className="text-[10px] text-slate-400 font-normal line-clamp-1">
                          {lc.description}
                        </div>
                      </td>

                      <td className="py-3 px-3 text-slate-600">
                        <span className="font-bold text-slate-900">{lc.classCategory}</span>
                        <div className="text-[10px] text-blue-700 font-semibold">{lc.subject}</div>
                      </td>

                      <td className="py-3 px-3 text-slate-700 font-medium">{lc.teacher}</td>

                      <td className="py-3 px-3 text-slate-600">
                        <div className="font-bold text-slate-800">{lc.date}</div>
                        <div className="text-[10px] text-slate-500">
                          {lc.startTime} ({lc.duration})
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          {lc.platform === 'google_meet' ? (
                            <span className="bg-emerald-50 text-emerald-800 font-bold text-[10px] px-2 py-0.5 rounded flex items-center gap-1">
                              <Video className="w-3 h-3" /> Meet
                            </span>
                          ) : (
                            <span className="bg-red-50 text-red-800 font-bold text-[10px] px-2 py-0.5 rounded flex items-center gap-1">
                              <Youtube className="w-3 h-3" /> YouTube
                            </span>
                          )}
                          <a
                            href={lc.meetingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded"
                            title="Test Meeting Link"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        {lc.status === 'live_now' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-red-600 text-white rounded-full text-[10px] font-black uppercase tracking-wider animate-pulse">
                            <span className="w-1.5 h-1.5 rounded-full bg-white" />
                            LIVE NOW
                          </span>
                        ) : lc.status === 'completed' ? (
                          <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-[10px] font-semibold">
                            Completed
                          </span>
                        ) : (
                          <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-[10px] font-bold">
                            Upcoming
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {lc.status === 'upcoming' && (
                            <button
                              onClick={() => startLiveClass(lc.id)}
                              className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[11px] font-black tracking-tight transition"
                              title="Broadcast that class is starting now"
                            >
                              Go LIVE
                            </button>
                          )}

                          {lc.status === 'live_now' && (
                            <button
                              onClick={() => endLiveClass(lc.id)}
                              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-[11px] font-bold transition"
                              title="End this live session"
                            >
                              End Session
                            </button>
                          )}

                          <button
                            onClick={() => openEditLiveClassModal(lc)}
                            className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="Edit Class Details"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => deleteLiveClass(lc.id)}
                            className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                            title="Cancel / Delete Class"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 8: EDITABLE CONTACT SETTINGS */}
      {activeSubTab === 'contact' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Phone className="w-4 h-4 text-blue-700" />
              <span>Editable Coaching Contact & Center Settings</span>
            </h2>
            <p className="text-xs text-slate-500">
              Update the official public contact numbers, WhatsApp helpline, email address, physical coaching campus location, and office timings. Changes are saved permanently in the database and automatically reflected on the Home page, Contact page, Navbar, and Footer.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Form Column */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <form onSubmit={handleSaveContactSettings} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Coaching Calling Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        required
                        placeholder="+91 98765 43210"
                        value={contactFormPhone}
                        onChange={(e) => setContactFormPhone(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      WhatsApp Helpline Number
                    </label>
                    <div className="relative">
                      <MessageCircle className="w-4 h-4 text-emerald-500 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        required
                        placeholder="+91 98765 43210"
                        value={contactFormWhatsapp}
                        onChange={(e) => setContactFormWhatsapp(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Official Coaching Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="email"
                        required
                        placeholder="satyam088kr@gmail.com"
                        value={contactFormEmail}
                        onChange={(e) => setContactFormEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Official Website URL
                    </label>
                    <div className="relative">
                      <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="url"
                        required
                        placeholder="https://teachingjunction.in"
                        value={contactFormWebsite}
                        onChange={(e) => setContactFormWebsite(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Director / Faculty Lead Name & Designation
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Er. Satyam Kumar (Director & Senior Faculty)"
                    value={contactFormDirector}
                    onChange={(e) => setContactFormDirector(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Physical Coaching Campus Address
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Building Name, Main Road, City, State - PIN"
                    value={contactFormAddress}
                    onChange={(e) => setContactFormAddress(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Office & Counseling Timings
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Monday - Saturday: 8:00 AM - 7:30 PM | Sunday: 9:00 AM - 1:00 PM"
                    value={contactFormHours}
                    onChange={(e) => setContactFormHours(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    Last updated: {contactInfo.updatedAt ? new Date(contactInfo.updatedAt).toLocaleString() : 'Default initial configuration'}
                  </span>
                  <button
                    type="submit"
                    disabled={contactSaving}
                    className="flex items-center gap-1.5 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-md transition active:scale-95"
                  >
                    <Save className="w-4 h-4" />
                    <span>{contactSaving ? 'Saving...' : 'Save Changes & Update Portal'}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Live Preview Card */}
            <div className="lg:col-span-5 bg-gradient-to-br from-blue-900 to-indigo-950 rounded-2xl p-6 text-white shadow-lg space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/15">
                <div className="font-bold text-sm flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Student View Preview</span>
                </div>
                <span className="text-[10px] bg-amber-400 text-slate-950 font-bold px-2 py-0.5 rounded">
                  Live Sync
                </span>
              </div>

              <div className="space-y-3 text-xs text-blue-100">
                <div>
                  <div className="text-[10px] uppercase text-blue-300 font-bold">Director:</div>
                  <div className="text-sm font-bold text-white">{contactFormDirector}</div>
                </div>

                <div>
                  <div className="text-[10px] uppercase text-blue-300 font-bold">Calling Phone:</div>
                  <div className="font-mono font-bold text-white">{contactFormPhone}</div>
                </div>

                <div>
                  <div className="text-[10px] uppercase text-emerald-300 font-bold">WhatsApp:</div>
                  <div className="font-mono font-bold text-emerald-200">{contactFormWhatsapp}</div>
                </div>

                <div>
                  <div className="text-[10px] uppercase text-blue-300 font-bold">Email:</div>
                  <div className="font-mono text-white">{contactFormEmail}</div>
                </div>

                <div>
                  <div className="text-[10px] uppercase text-blue-300 font-bold">Address:</div>
                  <div className="text-slate-200 leading-snug">{contactFormAddress}</div>
                </div>

                <div>
                  <div className="text-[10px] uppercase text-blue-300 font-bold">Office Hours:</div>
                  <div className="text-slate-200 leading-snug">{contactFormHours}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: ADD / EDIT COURSE MODAL */}
      {courseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 my-auto animate-in zoom-in-95 duration-200">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <h3 className="font-bold text-sm">
                {editingCourseId ? 'Edit Coaching Course' : 'Create New Coaching Course'}
              </h3>
              <button
                onClick={() => setCourseModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Course Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Class 10th Science Complete Foundation Batch"
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Class Category</label>
                  <select
                    value={courseClass}
                    onChange={(e) => setCourseClass(e.target.value as ClassCategory)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white focus:outline-none"
                  >
                    {ALL_CLASSES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subject</label>
                  <select
                    value={courseSubject}
                    onChange={(e) => setCourseSubject(e.target.value as SubjectCategory)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white focus:outline-none"
                  >
                    {ALL_SUBJECTS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Course Type</label>
                  <select
                    value={courseType}
                    onChange={(e) => setCourseType(e.target.value as 'free' | 'paid')}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white focus:outline-none"
                  >
                    <option value="free">FREE</option>
                    <option value="paid">PAID</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    disabled={courseType === 'free'}
                    value={courseType === 'free' ? 0 : coursePrice}
                    onChange={(e) => setCoursePrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none disabled:bg-slate-100"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    value={courseOriginalPrice}
                    onChange={(e) => setCourseOriginalPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Thumbnail Image URL</label>
                <input
                  type="url"
                  required
                  value={courseThumbnail}
                  onChange={(e) => setCourseThumbnail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-[11px] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Instructor</label>
                  <input
                    type="text"
                    value={courseInstructor}
                    onChange={(e) => setCourseInstructor(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Duration & Lectures</label>
                  <input
                    type="text"
                    value={courseDuration}
                    onChange={(e) => setCourseDuration(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={courseDescription}
                  onChange={(e) => setCourseDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCourseModalOpen(false)}
                  className="px-4 py-2 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow"
                >
                  Save Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD STUDY MATERIAL MODAL */}
      {materialModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 my-auto animate-in zoom-in-95 duration-200">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <h3 className="font-bold text-sm">Upload & Publish PDF Study Material</h3>
              <button
                onClick={() => setMaterialModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMaterial} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Class 10 Science Chapter 2 Acids, Bases and Salts Master Notes"
                  value={matTitle}
                  onChange={(e) => setMatTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Class</label>
                  <select
                    value={matClass}
                    onChange={(e) => setMatClass(e.target.value as ClassCategory)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white focus:outline-none"
                  >
                    {ALL_CLASSES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subject</label>
                  <select
                    value={matSubject}
                    onChange={(e) => setMatSubject(e.target.value as SubjectCategory)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white focus:outline-none"
                  >
                    {ALL_SUBJECTS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Chapter Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chapter 2: Acids, Bases and Salts"
                    value={matChapter}
                    onChange={(e) => setMatChapter(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Material Type</label>
                  <select
                    value={matType}
                    onChange={(e) => setMatType(e.target.value as MaterialType)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white focus:outline-none"
                  >
                    <option value="handwritten_notes">Handwritten Notes</option>
                    <option value="formula_sheet">Formula Sheet</option>
                    <option value="ncert_solution">NCERT Solution</option>
                    <option value="pyq_paper">PYQ Solved Paper</option>
                    <option value="sample_paper">Sample Paper</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Page Count</label>
                  <input
                    type="number"
                    value={matPages}
                    onChange={(e) => setMatPages(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">File Size</label>
                  <input
                    type="text"
                    value={matFileSize}
                    onChange={(e) => setMatFileSize(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Protected Content?</label>
                  <select
                    value={matIsProtected ? 'true' : 'false'}
                    onChange={(e) => setMatIsProtected(e.target.value === 'true')}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white focus:outline-none"
                  >
                    <option value="true">Yes (Approved Students)</option>
                    <option value="false">No (Public Demo)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Notes Summary & Content (For Built-in Reader)
                </label>
                <textarea
                  rows={4}
                  placeholder="Enter high-yield points, formulas, and concepts to appear in the PDF reader..."
                  value={matContent}
                  onChange={(e) => setMatContent(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-xs focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setMaterialModalOpen(false)}
                  className="px-4 py-2 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow"
                >
                  Publish Study Material
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ANNOUNCEMENT MODAL */}
      {annModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 my-auto animate-in zoom-in-95 duration-200">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <h3 className="font-bold text-sm">Publish New Notice</h3>
              <button
                onClick={() => setAnnModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePublishAnnouncement} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Notice Headline</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Schedule for Monthly Assessment Test"
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={annCategory}
                    onChange={(e) => setAnnCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white focus:outline-none"
                  >
                    <option value="batch">New Batch</option>
                    <option value="exam">Examination / Test</option>
                    <option value="holiday">Holiday Notice</option>
                    <option value="general">General Circular</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Urgency Mark</label>
                  <select
                    value={annUrgent ? 'true' : 'false'}
                    onChange={(e) => setAnnUrgent(e.target.value === 'true')}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white focus:outline-none"
                  >
                    <option value="false">Normal</option>
                    <option value="true">Urgent / Important</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Announcement Text</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Detailed guidelines, dates, timings, or instructions..."
                  value={annContent}
                  onChange={(e) => setAnnContent(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAnnModalOpen(false)}
                  className="px-4 py-2 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow"
                >
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: SCHEDULE / EDIT LIVE CLASS MODAL */}
      {liveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 my-auto animate-in zoom-in-95 duration-200">
            <div className="bg-red-900 text-white p-4 flex items-center justify-between">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Radio className="w-4 h-4 text-red-400" />
                <span>{editingLiveId ? 'Edit Live Classroom' : 'Schedule New Live Classroom'}</span>
              </h3>
              <button
                onClick={() => setLiveModalOpen(false)}
                className="text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLiveClass} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Live Class Title & Main Topic</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Class 10th Science Board Revision: Balancing Chemical Equations"
                  value={liveTitle}
                  onChange={(e) => setLiveTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Class</label>
                  <select
                    value={liveClass}
                    onChange={(e) => setLiveClass(e.target.value as ClassCategory)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white focus:outline-none"
                  >
                    {ALL_CLASSES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subject</label>
                  <select
                    value={liveSubject}
                    onChange={(e) => setLiveSubject(e.target.value as SubjectCategory)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white focus:outline-none"
                  >
                    {ALL_SUBJECTS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Teacher / Faculty</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Er. Satyam Kumar (Director)"
                    value={liveTeacher}
                    onChange={(e) => setLiveTeacher(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Current Status</label>
                  <select
                    value={liveStatus}
                    onChange={(e) => setLiveStatus(e.target.value as LiveClassStatus)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white focus:outline-none font-bold"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="live_now">🔴 Live Now</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Scheduled Date</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Today / 2026-11-02"
                    value={liveDate}
                    onChange={(e) => setLiveDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Start Time (IST)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 18:00 IST"
                    value={liveStartTime}
                    onChange={(e) => setLiveStartTime(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Duration</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 60 mins"
                    value={liveDuration}
                    onChange={(e) => setLiveDuration(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Meeting / Broadcast Link (Google Meet or YouTube Live URL)
                </label>
                <div className="space-y-1">
                  <input
                    type="url"
                    required
                    placeholder="https://meet.google.com/abc-defg-hij or https://youtube.com/live/..."
                    value={liveMeetingUrl}
                    onChange={(e) => {
                      const url = e.target.value;
                      setLiveMeetingUrl(url);
                      if (url.includes('meet.google.com')) setLivePlatform('google_meet');
                      else if (url.includes('youtube') || url.includes('youtu.be')) setLivePlatform('youtube_live');
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 font-mono text-xs"
                  />
                  <div className="text-[11px] text-slate-500">
                    Supports authentic <strong>Google Meet</strong> (e.g. meet.google.com/...) and <strong>YouTube Live</strong> links.
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Class Agenda & Description
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Outline key topics to be solved on the blackboard, homework doubts, and target board questions..."
                  value={liveDescription}
                  onChange={(e) => setLiveDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setLiveModalOpen(false)}
                  className="px-4 py-2 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow transition"
                >
                  {editingLiveId ? 'Update Live Class' : 'Schedule & Post Announcement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
