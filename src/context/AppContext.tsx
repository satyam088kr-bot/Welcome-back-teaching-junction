import React, { createContext, useContext, useEffect, useState } from 'react';
import { testConnection } from '../firebase/testConnection';
import {
  saveMaterialToFirestore,
  updateMaterialInFirestore,
  deleteMaterialFromFirestore,
  loadMaterialsFromFirestore,
  detectFileFormat,
} from '../firebase/materialsService';
import {
  ALL_CLASSES,
  ALL_SUBJECTS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_CONTACT,
  INITIAL_COURSES,
  INITIAL_LIVE_CLASSES,
  INITIAL_MATERIALS,
  INITIAL_PAYMENTS,
  INITIAL_USERS,
} from '../data/mockData';
import {
  Announcement,
  ClassCategory,
  ContactInfo,
  Course,
  LiveClass,
  LiveClassStatus,
  PaymentRecord,
  Role,
  StudyMaterial,
  SubjectCategory,
  TabType,
  User,
} from '../types';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
}

interface AppContextType {
  // Navigation & View
  currentTab: TabType;
  setCurrentTab: (tab: TabType) => void;
  selectedClass: ClassCategory | 'all';
  setSelectedClass: (cls: ClassCategory | 'all') => void;
  selectedSubject: SubjectCategory | 'all';
  setSelectedSubject: (sub: SubjectCategory | 'all') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCourseId: string | null;
  setSelectedCourseId: (id: string | null) => void;

  // Auth & Current User
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  allUsers: User[];
  loginAsUser: (userId: string) => void;
  registerStudent: (data: {
    name: string;
    email: string;
    phone: string;
    assignedClass: ClassCategory;
    password?: string;
  }) => { success: boolean; message: string };
  logout: () => void;
  switchUserRole: (role: Role) => void;

  // Admin User Actions
  approveStudent: (userId: string) => void;
  rejectStudent: (userId: string, reason: string) => void;
  suspendStudent: (userId: string) => void;
  reactivateStudent: (userId: string) => void;
  updateUserRole: (userId: string, role: Role) => void;
  deleteUser: (userId: string) => void;

  // Course Management
  courses: Course[];
  addCourse: (course: Omit<Course, 'id' | 'createdAt' | 'slug'>) => void;
  updateCourse: (id: string, updates: Partial<Course>) => void;
  deleteCourse: (id: string) => void;

  // Study Material Management
  materials: StudyMaterial[];
  addMaterial: (material: Omit<StudyMaterial, 'id' | 'createdAt' | 'downloadCount'>) => void;
  updateMaterial: (id: string, updates: Partial<StudyMaterial>) => void;
  deleteMaterial: (id: string) => void;
  incrementDownload: (id: string) => void;

  // Payments & Enrollments
  payments: PaymentRecord[];
  submitPayment: (data: {
    courseId: string;
    courseTitle: string;
    amount: number;
    transactionId: string;
    paymentMethod: 'upi' | 'bank_transfer' | 'qr_code';
    notes?: string;
  }) => boolean;
  verifyPayment: (paymentId: string) => void;
  rejectPayment: (paymentId: string, reason: string) => void;
  enrollInFreeCourse: (courseId: string) => boolean;

  // Announcements
  announcements: Announcement[];
  addAnnouncement: (announcement: Omit<Announcement, 'id'>) => void;
  deleteAnnouncement: (id: string) => void;

  // Contact Info Settings (Admin editable & persistent)
  contactInfo: ContactInfo;
  updateContactInfo: (updates: Partial<ContactInfo>) => boolean;

  // Live Classes Management & Student Joining
  liveClasses: LiveClass[];
  addLiveClass: (data: Omit<LiveClass, 'id' | 'createdAt'>) => void;
  updateLiveClass: (id: string, updates: Partial<LiveClass>) => void;
  deleteLiveClass: (id: string) => void;
  startLiveClass: (id: string) => void;
  endLiveClass: (id: string) => void;

  // Modals & Interactive Viewers
  activePdfMaterial: StudyMaterial | null;
  setActivePdfMaterial: (mat: StudyMaterial | null) => void;
  checkoutCourse: Course | null;
  setCheckoutCourse: (course: Course | null) => void;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'register';
  setAuthModalMode: (mode: 'login' | 'register') => void;
  apkModalOpen: boolean;
  setApkModalOpen: (open: boolean) => void;

  // Toast notifications
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;

  // Reset to initial demo data
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation State
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [selectedClass, setSelectedClass] = useState<ClassCategory | 'all'>('all');
  const [selectedSubject, setSelectedSubject] = useState<SubjectCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  // Users State
  const [allUsers, setAllUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem('tj_users');
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  // Current Active User - default to admin satyam088kr for easy review, or approved student
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const savedId = localStorage.getItem('tj_active_user_id');
      const found = allUsers.find((u) => u.id === savedId);
      return found || allUsers[0]; // defaults to Master Admin Satyam Kumar
    } catch {
      return allUsers[0];
    }
  });

  // Courses State
  const [courses, setCourses] = useState<Course[]>(() => {
    try {
      const saved = localStorage.getItem('tj_courses');
      return saved ? JSON.parse(saved) : INITIAL_COURSES;
    } catch {
      return INITIAL_COURSES;
    }
  });

  // Materials State
  const [materials, setMaterials] = useState<StudyMaterial[]>(() => {
    try {
      const saved = localStorage.getItem('tj_materials');
      return saved ? JSON.parse(saved) : INITIAL_MATERIALS;
    } catch {
      return INITIAL_MATERIALS;
    }
  });

  // Payments State
  const [payments, setPayments] = useState<PaymentRecord[]>(() => {
    try {
      const saved = localStorage.getItem('tj_payments');
      return saved ? JSON.parse(saved) : INITIAL_PAYMENTS;
    } catch {
      return INITIAL_PAYMENTS;
    }
  });

  // Announcements State
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    try {
      const saved = localStorage.getItem('tj_announcements');
      return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
    } catch {
      return INITIAL_ANNOUNCEMENTS;
    }
  });

  // Contact Info State (Persisted)
  const [contactInfo, setContactInfo] = useState<ContactInfo>(() => {
    try {
      const saved = localStorage.getItem('tj_contact');
      return saved ? JSON.parse(saved) : INITIAL_CONTACT;
    } catch {
      return INITIAL_CONTACT;
    }
  });

  // Live Classes State (Persisted)
  const [liveClasses, setLiveClasses] = useState<LiveClass[]>(() => {
    try {
      const saved = localStorage.getItem('tj_live_classes');
      return saved ? JSON.parse(saved) : INITIAL_LIVE_CLASSES;
    } catch {
      return INITIAL_LIVE_CLASSES;
    }
  });

  // Modals
  const [activePdfMaterial, setActivePdfMaterial] = useState<StudyMaterial | null>(null);
  const [checkoutCourse, setCheckoutCourse] = useState<Course | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [apkModalOpen, setApkModalOpen] = useState(false);

  // Validate connection to Firestore and load cloud materials on initial boot
  useEffect(() => {
    testConnection();
    loadMaterialsFromFirestore()
      .then((cloudMaterials) => {
        if (cloudMaterials && cloudMaterials.length > 0) {
          setMaterials((prev) => {
            const merged = [...cloudMaterials];
            prev.forEach((local) => {
              if (!merged.some((m) => m.id === local.id)) {
                merged.push(local);
              }
            });
            return merged;
          });
        }
      })
      .catch((err) => console.warn('Could not sync cloud materials:', err));
  }, []);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync state to local storage
  useEffect(() => {
    try {
      localStorage.setItem('tj_users', JSON.stringify(allUsers));
    } catch (e) {
      console.warn('Storage sync failed', e);
    }
  }, [allUsers]);

  useEffect(() => {
    try {
      localStorage.setItem('tj_courses', JSON.stringify(courses));
    } catch (e) {
      console.warn('Storage sync failed', e);
    }
  }, [courses]);

  useEffect(() => {
    try {
      localStorage.setItem('tj_materials', JSON.stringify(materials));
    } catch (e) {
      console.warn('Storage sync failed', e);
    }
  }, [materials]);

  useEffect(() => {
    try {
      localStorage.setItem('tj_payments', JSON.stringify(payments));
    } catch (e) {
      console.warn('Storage sync failed', e);
    }
  }, [payments]);

  useEffect(() => {
    try {
      localStorage.setItem('tj_announcements', JSON.stringify(announcements));
    } catch (e) {
      console.warn('Storage sync failed', e);
    }
  }, [announcements]);

  useEffect(() => {
    try {
      localStorage.setItem('tj_contact', JSON.stringify(contactInfo));
    } catch (e) {
      console.warn('Storage sync failed', e);
    }
  }, [contactInfo]);

  useEffect(() => {
    try {
      localStorage.setItem('tj_live_classes', JSON.stringify(liveClasses));
    } catch (e) {
      console.warn('Storage sync failed', e);
    }
  }, [liveClasses]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('tj_active_user_id', currentUser.id);
    } else {
      localStorage.removeItem('tj_active_user_id');
    }
  }, [currentUser]);

  // Login handler
  const loginAsUser = (userId: string) => {
    const user = allUsers.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
      addToast({
        type: 'success',
        title: `Logged in as ${user.name}`,
        message: `Role: ${user.role.toUpperCase()} | Status: ${user.status.toUpperCase()}`,
      });
    }
  };

  // Register Student handler
  const registerStudent = (data: {
    name: string;
    email: string;
    phone: string;
    assignedClass: ClassCategory;
    password?: string;
  }) => {
    const existing = allUsers.find((u) => u.email.toLowerCase() === data.email.toLowerCase());
    if (existing) {
      return { success: false, message: 'An account with this email address already exists!' };
    }

    const newStudent: User = {
      id: 'student-' + Date.now(),
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim(),
      role: 'student',
      status: 'pending', // REQUIRED: Every new student account must remain PENDING until an admin approves it
      assignedClass: data.assignedClass,
      createdAt: new Date().toISOString(),
      enrolledCourseIds: [],
    };

    setAllUsers((prev) => [newStudent, ...prev]);
    setCurrentUser(newStudent);
    addToast({
      type: 'warning',
      title: 'Registration Pending Approval',
      message: 'Your student account is awaiting administrative approval by Teaching Junction Coaching.',
    });

    return {
      success: true,
      message: 'Account registered successfully! It is now pending admin approval before protected notes can be accessed.',
    };
  };

  const logout = () => {
    setCurrentUser(null);
    addToast({
      type: 'info',
      title: 'Logged Out',
      message: 'You have been signed out of Teaching Junction Coaching.',
    });
  };

  const switchUserRole = (role: Role) => {
    if (!currentUser) return;
    const updated = { ...currentUser, role };
    setCurrentUser(updated);
    setAllUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    addToast({
      type: 'info',
      title: `Switched role to ${role.toUpperCase()}`,
    });
  };

  // Admin student approval management
  const approveStudent = (userId: string) => {
    setAllUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          return {
            ...u,
            status: 'approved',
            approvedAt: new Date().toISOString(),
            rejectionReason: undefined,
          };
        }
        return u;
      })
    );

    if (currentUser?.id === userId) {
      setCurrentUser((prev) =>
        prev
          ? {
              ...prev,
              status: 'approved',
              approvedAt: new Date().toISOString(),
              rejectionReason: undefined,
            }
          : null
      );
    }

    addToast({
      type: 'success',
      title: 'Student Account Approved',
      message: 'Full access to courses and study materials has been granted.',
    });
  };

  const rejectStudent = (userId: string, reason: string) => {
    setAllUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          return {
            ...u,
            status: 'rejected',
            rejectionReason: reason || 'Application did not meet coaching verification criteria.',
          };
        }
        return u;
      })
    );

    if (currentUser?.id === userId) {
      setCurrentUser((prev) =>
        prev
          ? {
              ...prev,
              status: 'rejected',
              rejectionReason: reason,
            }
          : null
      );
    }

    addToast({
      type: 'error',
      title: 'Student Account Rejected',
      message: 'Student status updated to Rejected.',
    });
  };

  const suspendStudent = (userId: string) => {
    setAllUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          return { ...u, status: 'suspended' };
        }
        return u;
      })
    );

    if (currentUser?.id === userId) {
      setCurrentUser((prev) => (prev ? { ...prev, status: 'suspended' } : null));
    }

    addToast({
      type: 'warning',
      title: 'Student Suspended',
      message: 'Access temporarily suspended.',
    });
  };

  const reactivateStudent = (userId: string) => {
    approveStudent(userId);
  };

  const updateUserRole = (userId: string, role: Role) => {
    setAllUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role } : u))
    );
    if (currentUser?.id === userId) {
      setCurrentUser((prev) => (prev ? { ...prev, role } : null));
    }
    addToast({
      type: 'success',
      title: `Role updated to ${role.toUpperCase()}`,
    });
  };

  const deleteUser = (userId: string) => {
    setAllUsers((prev) => prev.filter((u) => u.id !== userId));
    if (currentUser?.id === userId) {
      setCurrentUser(null);
    }
    addToast({
      type: 'info',
      title: 'User Removed',
      message: 'Student account deleted from database.',
    });
  };

  // Course Actions
  const addCourse = (data: Omit<Course, 'id' | 'createdAt' | 'slug'>) => {
    const slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    const newCourse: Course = {
      ...data,
      id: 'course-' + Date.now(),
      slug,
      createdAt: new Date().toISOString(),
    };
    setCourses((prev) => [newCourse, ...prev]);
    addToast({
      type: 'success',
      title: 'Course Created Successfully',
      message: `${newCourse.title} is now published.`,
    });
  };

  const updateCourse = (id: string, updates: Partial<Course>) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c))
    );
    addToast({
      type: 'success',
      title: 'Course Updated',
      message: 'All changes saved.',
    });
  };

  const deleteCourse = (id: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== id));
    addToast({
      type: 'info',
      title: 'Course Deleted',
      message: 'The course has been removed.',
    });
  };

  // Study Material Actions
  const addMaterial = (data: Omit<StudyMaterial, 'id' | 'createdAt' | 'downloadCount'>) => {
    const fileFormat = data.fileFormat || (data.fileName ? detectFileFormat(data.fileName) : 'pdf');
    const newMaterial: StudyMaterial = {
      ...data,
      id: 'mat-' + Date.now(),
      fileFormat,
      downloadCount: 0,
      createdAt: new Date().toISOString(),
      uploadDate: data.uploadDate || new Date().toISOString().split('T')[0],
    };
    setMaterials((prev) => [newMaterial, ...prev]);

    // Persist to Cloud Firestore in background
    saveMaterialToFirestore(newMaterial).catch((err) => {
      console.warn('Could not persist material to Firestore:', err);
    });

    addToast({
      type: 'success',
      title: 'Study Note Uploaded & Published',
      message: `${newMaterial.title} (${fileFormat.toUpperCase()}) is now accessible to approved students.`,
    });
  };

  const updateMaterial = (id: string, updates: Partial<StudyMaterial>) => {
    setMaterials((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const updated = { ...m, ...updates };
          updateMaterialInFirestore(id, updates).catch((err) => {
            console.warn('Could not update material in Firestore:', err);
          });
          return updated;
        }
        return m;
      })
    );
    addToast({
      type: 'success',
      title: 'Study Material Updated',
      message: 'Changes saved to Cloud Firestore.',
    });
  };

  const deleteMaterial = (id: string) => {
    const target = materials.find((m) => m.id === id);
    setMaterials((prev) => prev.filter((m) => m.id !== id));

    // Delete from Firestore and clean up storage file if present
    deleteMaterialFromFirestore(id, target?.storagePath).catch((err) => {
      console.warn('Could not delete material from Firestore:', err);
    });

    addToast({
      type: 'info',
      title: 'Study Material Deleted',
      message: 'Removed from Cloud storage and student portals.',
    });
  };

  const incrementDownload = (id: string) => {
    setMaterials((prev) =>
      prev.map((m) => (m.id === id ? { ...m, downloadCount: m.downloadCount + 1 } : m))
    );
  };

  // Payments & Enrollments
  const submitPayment = (data: {
    courseId: string;
    courseTitle: string;
    amount: number;
    transactionId: string;
    paymentMethod: 'upi' | 'bank_transfer' | 'qr_code';
    notes?: string;
  }) => {
    if (!currentUser) {
      addToast({
        type: 'error',
        title: 'Authentication Required',
        message: 'Please login or register to submit course payment.',
      });
      return false;
    }

    const newPayment: PaymentRecord = {
      id: 'pay-' + Date.now(),
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentEmail: currentUser.email,
      studentPhone: currentUser.phone,
      courseId: data.courseId,
      courseTitle: data.courseTitle,
      amount: data.amount,
      paymentMethod: data.paymentMethod,
      transactionId: data.transactionId.trim(),
      status: 'pending_verification',
      notes: data.notes,
      submittedAt: new Date().toISOString(),
    };

    setPayments((prev) => [newPayment, ...prev]);
    addToast({
      type: 'success',
      title: 'Payment Submitted For Admin Verification',
      message: `Transaction Reference ${data.transactionId} recorded. Course access will unlock upon verification!`,
    });
    return true;
  };

  const verifyPayment = (paymentId: string) => {
    const payment = payments.find((p) => p.id === paymentId);
    if (!payment) return;

    const now = new Date().toISOString();

    // Mark payment as verified
    setPayments((prev) =>
      prev.map((p) => (p.id === paymentId ? { ...p, status: 'verified', verifiedAt: now } : p))
    );

    // Automatically enroll the student in the course
    setAllUsers((prev) =>
      prev.map((u) => {
        if (u.id === payment.studentId) {
          const currentEnrolled = u.enrolledCourseIds || [];
          if (!currentEnrolled.includes(payment.courseId)) {
            return {
              ...u,
              enrolledCourseIds: [...currentEnrolled, payment.courseId],
            };
          }
        }
        return u;
      })
    );

    // If current user is the same student, update their session too
    if (currentUser?.id === payment.studentId) {
      setCurrentUser((prev) => {
        if (!prev) return null;
        const currentEnrolled = prev.enrolledCourseIds || [];
        return {
          ...prev,
          enrolledCourseIds: currentEnrolled.includes(payment.courseId)
            ? currentEnrolled
            : [...currentEnrolled, payment.courseId],
        };
      });
    }

    // Increment course enrolledCount
    setCourses((prev) =>
      prev.map((c) => (c.id === payment.courseId ? { ...c, enrolledCount: c.enrolledCount + 1 } : c))
    );

    addToast({
      type: 'success',
      title: 'Payment Verified & Course Access Granted',
      message: `${payment.studentName} has been enrolled in ${payment.courseTitle}.`,
    });
  };

  const rejectPayment = (paymentId: string, reason: string) => {
    setPayments((prev) =>
      prev.map((p) =>
        p.id === paymentId
          ? {
              ...p,
              status: 'rejected',
              rejectionReason: reason || 'Invalid transaction reference or unconfirmed receipt.',
            }
          : p
      )
    );
    addToast({
      type: 'warning',
      title: 'Payment Record Rejected',
      message: 'Student will be notified to resubmit valid transaction details.',
    });
  };

  const enrollInFreeCourse = (courseId: string) => {
    if (!currentUser) {
      setAuthModalMode('login');
      setAuthModalOpen(true);
      return false;
    }

    if (currentUser.status !== 'approved') {
      addToast({
        type: 'warning',
        title: 'Account Approval Required',
        message: 'Your account is pending approval by the administration before accessing courses.',
      });
      return false;
    }

    if (currentUser.enrolledCourseIds.includes(courseId)) {
      addToast({
        type: 'info',
        title: 'Already Enrolled',
        message: 'You are already enrolled in this course.',
      });
      return true;
    }

    const updatedEnrolled = [...currentUser.enrolledCourseIds, courseId];
    const updatedUser = { ...currentUser, enrolledCourseIds: updatedEnrolled };
    setCurrentUser(updatedUser);
    setAllUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updatedUser : u)));

    // Increment count
    setCourses((prev) =>
      prev.map((c) => (c.id === courseId ? { ...c, enrolledCount: c.enrolledCount + 1 } : c))
    );

    addToast({
      type: 'success',
      title: 'Enrolled Successfully!',
      message: 'You now have full access to all lectures and study notes for this course.',
    });
    return true;
  };

  // Announcements
  const addAnnouncement = (data: Omit<Announcement, 'id'>) => {
    const newAnn: Announcement = {
      ...data,
      id: 'ann-' + Date.now(),
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
    addToast({
      type: 'success',
      title: 'Announcement Published',
      message: newAnn.title,
    });
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    addToast({
      type: 'info',
      title: 'Announcement Deleted',
    });
  };

  // Contact Info Management (Admin Only)
  const updateContactInfo = (updates: Partial<ContactInfo>): boolean => {
    if (currentUser?.role !== 'admin') {
      addToast({
        type: 'error',
        title: 'Unauthorized Action',
        message: 'Only authorized coaching administrators can update contact settings.',
      });
      return false;
    }

    // Validation
    if (updates.email && !updates.email.includes('@')) {
      addToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Please provide a valid coaching email address.',
      });
      return false;
    }

    if (updates.phone && updates.phone.trim().length < 8) {
      addToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Please provide a valid coaching phone number.',
      });
      return false;
    }

    const updated: ContactInfo = {
      ...contactInfo,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    setContactInfo(updated);
    addToast({
      type: 'success',
      title: 'Contact Details Saved',
      message: 'Coaching phone, WhatsApp, email, and address updated across the platform.',
    });
    return true;
  };

  // Live Classes Management
  const addLiveClass = (data: Omit<LiveClass, 'id' | 'createdAt'>) => {
    if (currentUser?.role !== 'admin') {
      addToast({
        type: 'error',
        title: 'Unauthorized Action',
        message: 'Only administrators can schedule live classes.',
      });
      return;
    }

    const newLiveClass: LiveClass = {
      ...data,
      id: 'live-' + Date.now(),
      createdAt: new Date().toISOString(),
    };

    setLiveClasses((prev) => [newLiveClass, ...prev]);

    // Send in-app announcement notice automatically for upcoming class!
    addAnnouncement({
      title: `🔴 Live Class Scheduled: ${newLiveClass.title}`,
      content: `Live session for ${newLiveClass.classCategory} (${newLiveClass.subject}) scheduled on ${newLiveClass.date} at ${newLiveClass.startTime} by ${newLiveClass.teacher}. Approved students can join via Google Meet / YouTube Live.`,
      category: 'exam',
      urgent: true,
      date: new Date().toISOString().split('T')[0],
      author: newLiveClass.teacher,
    });

    addToast({
      type: 'success',
      title: 'Live Class Scheduled',
      message: `${newLiveClass.title} published and student notice posted.`,
    });
  };

  const updateLiveClass = (id: string, updates: Partial<LiveClass>) => {
    if (currentUser?.role !== 'admin') {
      addToast({
        type: 'error',
        title: 'Unauthorized Action',
      });
      return;
    }

    setLiveClasses((prev) =>
      prev.map((lc) => (lc.id === id ? { ...lc, ...updates } : lc))
    );

    addToast({
      type: 'success',
      title: 'Live Class Updated',
      message: 'Changes saved successfully.',
    });
  };

  const deleteLiveClass = (id: string) => {
    if (currentUser?.role !== 'admin') return;
    setLiveClasses((prev) => prev.filter((lc) => lc.id !== id));
    addToast({
      type: 'info',
      title: 'Live Class Cancelled/Removed',
    });
  };

  const startLiveClass = (id: string) => {
    if (currentUser?.role !== 'admin') return;
    setLiveClasses((prev) =>
      prev.map((lc) => (lc.id === id ? { ...lc, status: 'live_now' } : lc))
    );

    const target = liveClasses.find((lc) => lc.id === id);
    if (target) {
      addAnnouncement({
        title: `⚡ LIVE NOW: ${target.title}`,
        content: `Class is live right now! Join ${target.teacher} on ${target.platform === 'google_meet' ? 'Google Meet' : 'YouTube Live'}. Tap 'Live Classes' in menu to enter.`,
        category: 'exam',
        urgent: true,
        date: new Date().toISOString().split('T')[0],
        author: target.teacher,
      });
    }

    addToast({
      type: 'success',
      title: 'Class is Now LIVE!',
      message: 'Students can now join the live meeting room.',
    });
  };

  const endLiveClass = (id: string) => {
    if (currentUser?.role !== 'admin') return;
    setLiveClasses((prev) =>
      prev.map((lc) => (lc.id === id ? { ...lc, status: 'completed' } : lc))
    );
    addToast({
      type: 'info',
      title: 'Live Class Completed',
      message: 'Session ended and marked completed.',
    });
  };

  const resetAllData = () => {
    localStorage.removeItem('tj_users');
    localStorage.removeItem('tj_courses');
    localStorage.removeItem('tj_materials');
    localStorage.removeItem('tj_payments');
    localStorage.removeItem('tj_announcements');
    localStorage.removeItem('tj_contact');
    localStorage.removeItem('tj_live_classes');
    localStorage.removeItem('tj_active_user_id');

    setAllUsers(INITIAL_USERS);
    setCurrentUser(INITIAL_USERS[0]);
    setCourses(INITIAL_COURSES);
    setMaterials(INITIAL_MATERIALS);
    setPayments(INITIAL_PAYMENTS);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setContactInfo(INITIAL_CONTACT);
    setLiveClasses(INITIAL_LIVE_CLASSES);

    addToast({
      type: 'info',
      title: 'Database Reset',
      message: 'Restored initial demo dataset with courses, notes, and students.',
    });
  };

  return (
    <AppContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        selectedClass,
        setSelectedClass,
        selectedSubject,
        setSelectedSubject,
        searchQuery,
        setSearchQuery,
        selectedCourseId,
        setSelectedCourseId,

        currentUser,
        setCurrentUser,
        allUsers,
        loginAsUser,
        registerStudent,
        logout,
        switchUserRole,

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
        updateMaterial,
        deleteMaterial,
        incrementDownload,

        payments,
        submitPayment,
        verifyPayment,
        rejectPayment,
        enrollInFreeCourse,

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

        activePdfMaterial,
        setActivePdfMaterial,
        checkoutCourse,
        setCheckoutCourse,
        authModalOpen,
        setAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        apkModalOpen,
        setApkModalOpen,

        toasts,
        addToast,
        removeToast,

        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
