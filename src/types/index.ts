export type Role = 'admin' | 'student';
export type AccountStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

export type ClassCategory =
  | 'Class 6th'
  | 'Class 7th'
  | 'Class 8th'
  | 'Class 9th'
  | 'Class 10th'
  | 'Class 11th'
  | 'Class 12th'
  | 'Competitive Exams';

export type SubjectCategory =
  | 'Science'
  | 'Mathematics'
  | 'Social Science'
  | 'History'
  | 'Geography'
  | 'Civics'
  | 'Economics'
  | 'Hindi'
  | 'English';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  status: AccountStatus;
  assignedClass: ClassCategory;
  avatar?: string;
  createdAt: string;
  approvedAt?: string;
  enrolledCourseIds: string[];
  rejectionReason?: string;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  videoUrl?: string;
  pdfNoteUrl?: string;
  pdfTitle?: string;
  isFreePreview?: boolean;
  summary?: string;
}

export interface Chapter {
  id: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  classCategory: ClassCategory;
  subject: SubjectCategory;
  type: 'free' | 'paid';
  price: number;
  originalPrice?: number;
  thumbnail: string;
  description: string;
  instructor: string;
  language: string;
  rating: number;
  enrolledCount: number;
  duration: string;
  isFeatured?: boolean;
  chapters: Chapter[];
  createdAt: string;
  updatedAt?: string;
}

export type MaterialType =
  | 'ncert_solution'
  | 'handwritten_notes'
  | 'formula_sheet'
  | 'pyq_paper'
  | 'sample_paper';

export type FileFormat =
  | 'pdf'
  | 'doc'
  | 'docx'
  | 'xls'
  | 'xlsx'
  | 'ppt'
  | 'pptx'
  | 'jpg'
  | 'jpeg'
  | 'png'
  | 'txt'
  | 'other';

export interface StudyMaterial {
  id: string;
  title: string;
  description: string;
  classCategory: ClassCategory;
  subject: SubjectCategory;
  chapterName: string;
  fileUrl: string;
  fileSize: string;
  pageCount: number;
  downloadCount: number;
  type: MaterialType;
  fileFormat?: FileFormat;
  fileName?: string;
  fileSizeBytes?: number;
  storagePath?: string;
  uploadDate?: string;
  isProtected: boolean; // only approved students can view/download
  createdAt: string;
  contentPreview?: string; // Text sample or extracted summary
}

export type PaymentStatus = 'pending_verification' | 'verified' | 'rejected';

export interface PaymentRecord {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  courseId: string;
  courseTitle: string;
  amount: number;
  paymentMethod: 'upi' | 'bank_transfer' | 'qr_code';
  transactionId: string; // 12-digit UPI / UTR number
  screenshotUrl?: string;
  status: PaymentStatus;
  notes?: string;
  submittedAt: string;
  verifiedAt?: string;
  rejectionReason?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: 'exam' | 'batch' | 'holiday' | 'general';
  urgent: boolean;
  date: string;
  author: string;
}

export interface ContactInfo {
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  website: string;
  officeHours: string;
  directorName: string;
  mapEmbedUrl?: string;
  updatedAt?: string;
}

export type LiveClassStatus = 'upcoming' | 'live_now' | 'completed' | 'cancelled';
export type MeetingPlatform = 'google_meet' | 'youtube_live' | 'zoom' | 'other';

export interface LiveClass {
  id: string;
  title: string;
  classCategory: ClassCategory;
  subject: SubjectCategory;
  teacher: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM (e.g. 18:00)
  duration: string; // e.g. 60 mins
  description: string;
  meetingUrl: string; // Real Google Meet or YouTube Live link
  platform: MeetingPlatform;
  status: LiveClassStatus;
  courseId?: string;
  isFreeForApprovedStudents: boolean;
  createdAt: string;
}

export type TabType =
  | 'home'
  | 'free_courses'
  | 'paid_courses'
  | 'live_classes'
  | 'materials'
  | 'announcements'
  | 'contact'
  | 'course_detail'
  | 'enrolled'
  | 'profile'
  | 'admin';
