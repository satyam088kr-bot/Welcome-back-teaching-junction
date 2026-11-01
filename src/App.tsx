import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { MobileNav } from './components/layout/MobileNav';
import { Footer } from './components/layout/Footer';
import { HomeView } from './components/home/HomeView';
import { CoursesView } from './components/courses/CoursesView';
import { CourseDetailView } from './components/courses/CourseDetailView';
import { MaterialsView } from './components/materials/MaterialsView';
import { AnnouncementsView } from './components/home/AnnouncementsView';
import { EnrolledCoursesView } from './components/student/EnrolledCoursesView';
import { StudentProfileView } from './components/student/StudentProfileView';
import { LiveClassesView } from './components/live/LiveClassesView';
import { ContactView } from './components/contact/ContactView';
import { AdminPanel } from './components/admin/AdminPanel';
import { AuthModal } from './components/auth/AuthModal';
import { CheckoutModal } from './components/common/CheckoutModal';
import { PdfViewerModal } from './components/common/PdfViewerModal';
import { APKDownloadModal } from './components/apk/APKDownloadModal';
import { ToastContainer } from './components/common/ToastContainer';
import { OfflineIndicator } from './components/pwa/OfflineIndicator';

function AppContent() {
  const {
    currentTab,
    setCurrentTab,
    selectedCourseId,
    courses,
    activePdfMaterial,
    setActivePdfMaterial,
    checkoutCourse,
    setCheckoutCourse,
    apkModalOpen,
    setApkModalOpen,
  } = useApp();

  const selectedCourse = courses.find((c) => c.id === selectedCourseId) || courses[0];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-6">
        {currentTab === 'home' && <HomeView />}
        {currentTab === 'free_courses' && <CoursesView courseTypeFilter="free" />}
        {currentTab === 'paid_courses' && <CoursesView courseTypeFilter="paid" />}
        {currentTab === 'live_classes' && <LiveClassesView />}
        {currentTab === 'materials' && <MaterialsView />}
        {currentTab === 'contact' && <ContactView />}
        {currentTab === 'announcements' && <AnnouncementsView />}
        {currentTab === 'enrolled' && <EnrolledCoursesView />}
        {currentTab === 'profile' && <StudentProfileView />}
        {currentTab === 'admin' && <AdminPanel />}
        {currentTab === 'course_detail' && selectedCourse && (
          <CourseDetailView
            course={selectedCourse}
            onBack={() => setCurrentTab('free_courses')}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* Interactive Global Modals */}
      <AuthModal />
      {checkoutCourse && (
        <CheckoutModal course={checkoutCourse} onClose={() => setCheckoutCourse(null)} />
      )}
      {activePdfMaterial && (
        <PdfViewerModal
          material={activePdfMaterial}
          onClose={() => setActivePdfMaterial(null)}
        />
      )}
      <APKDownloadModal isOpen={apkModalOpen} onClose={() => setApkModalOpen(false)} />

      {/* Toast Notifications */}
      <ToastContainer />

      {/* Offline Status Indicator */}
      <OfflineIndicator />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
