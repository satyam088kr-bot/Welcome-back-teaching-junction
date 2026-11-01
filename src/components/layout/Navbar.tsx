import React, { useState } from 'react';
import {
  Bell,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  GraduationCap,
  Layers,
  Lock,
  LogOut,
  Phone,
  Radio,
  Search,
  Shield,
  ShieldAlert,
  Smartphone,
  Sparkles,
  User,
  X,
  CreditCard,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PWAInstallButton } from '../pwa/PWAInstallButton';
import { TabType } from '../../types';

export const Navbar: React.FC = () => {
  const {
    currentTab,
    setCurrentTab,
    searchQuery,
    setSearchQuery,
    currentUser,
    logout,
    setAuthModalOpen,
    setAuthModalMode,
    setApkModalOpen,
    payments,
    contactInfo,
    liveClasses,
  } = useApp();

  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  // Check pending payments count for admin badge
  const pendingPaymentsCount = payments.filter((p) => p.status === 'pending_verification').length;
  const hasLiveNow = liveClasses.some((c) => c.status === 'live_now');

  const navItems: { id: TabType; label: string; icon?: React.ReactNode; badge?: string; isLivePulse?: boolean }[] = [
    { id: 'home', label: 'Home' },
    { id: 'free_courses', label: 'Free Courses', badge: 'Free' },
    { id: 'paid_courses', label: 'Paid Courses' },
    {
      id: 'live_classes',
      label: 'Live Classes',
      icon: <Radio className={`w-3.5 h-3.5 ${hasLiveNow ? 'text-red-500 animate-pulse' : 'text-slate-500'}`} />,
      badge: hasLiveNow ? 'LIVE' : undefined,
      isLivePulse: hasLiveNow,
    },
    { id: 'materials', label: 'Study Materials (PDF)', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { id: 'announcements', label: 'Notices' },
    { id: 'contact', label: 'Contact Us' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/90 shadow-xs">
      {/* Top Announcement & Helpline Bar with DYNAMIC contact details */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-950 text-white text-[11px] py-1.5 px-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-hidden truncate">
            <span className="bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider shrink-0">
              Notice
            </span>
            <span className="truncate text-blue-100">
              {hasLiveNow
                ? '🔴 Class is LIVE right now! Tap Live Classes to join the interactive meeting.'
                : '🎯 New Batch starting for Class 10th & 12th Board Exams! Enroll in free demo lessons & download NCERT PDF notes.'}
            </span>
          </div>

          <div className="hidden md:flex items-center gap-4 shrink-0 text-blue-200">
            <a
              href={`tel:${contactInfo.phone.replace(/[^0-9]/g, '')}`}
              className="flex items-center gap-1.5 hover:text-white transition"
              title="Click to call coaching desk"
            >
              <Phone className="w-3 h-3 text-amber-300" />
              <span>Helpline: {contactInfo.phone}</span>
            </a>
            <span>|</span>
            <span>{contactInfo.directorName}</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-3 sm:gap-6">
        {/* Logo and Brand */}
        <div
          onClick={() => setCurrentTab('home')}
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer shrink-0 group select-none"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition">
            <GraduationCap className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-sm sm:text-base text-blue-900 tracking-tight leading-tight">
                Teaching Junction
              </span>
              <span className="hidden sm:inline-block text-[10px] font-black bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded uppercase">
                Coaching
              </span>
            </div>
            <div className="text-[10px] sm:text-[11px] text-slate-500 font-medium">
              Study Material & Digital Learning
            </div>
          </div>
        </div>

        {/* Global Search Input (Desktop) */}
        <div className="hidden lg:flex flex-1 max-w-md relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search class, subject, notes, or course (e.g. Science, Trigonometry)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 border border-slate-300/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2.5 p-0.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`relative px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  isActive
                    ? 'text-blue-700 bg-blue-50/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`text-[9px] font-black px-1.5 py-0.2 rounded ${
                      item.isLivePulse
                        ? 'bg-red-600 text-white animate-pulse'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-blue-600 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Actions: PWA Install + Admin Link + User Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile search toggle */}
          <button
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* PWA Install Button */}
          <PWAInstallButton />

          {/* Download Official Android APK Button */}
          <button
            onClick={() => setApkModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-xs transition active:scale-95"
            title="Download Official Android APK (.apk)"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Get APK</span>
            <span className="sm:hidden">APK</span>
          </button>

          {/* Admin Panel Quick Access Button (Always visible to Admin or if user wants to review) */}
          {currentUser?.role === 'admin' && (
            <button
              onClick={() => setCurrentTab('admin')}
              className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-xs ${
                currentTab === 'admin'
                  ? 'bg-blue-700 text-white'
                  : 'bg-blue-50 text-blue-900 border border-blue-200 hover:bg-blue-100'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-blue-700 dark:text-blue-200" />
              <span>Admin Panel</span>
              {pendingPaymentsCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] flex items-center justify-center">
                  {pendingPaymentsCount}
                </span>
              )}
            </button>
          )}

          {/* User Account / Profile Menu */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-2 p-1 sm:p-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 transition"
              >
                <div className="relative">
                  {currentUser.avatar ? (
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg object-cover border border-slate-300"
                    />
                  ) : (
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-700 text-white flex items-center justify-center font-bold text-xs">
                      {currentUser.name.charAt(0)}
                    </div>
                  )}
                  {/* Status Indicator Dot */}
                  <span
                    className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${
                      currentUser.role === 'admin'
                        ? 'bg-blue-600'
                        : currentUser.status === 'approved'
                        ? 'bg-emerald-500'
                        : currentUser.status === 'pending'
                        ? 'bg-amber-500'
                        : 'bg-red-500'
                    }`}
                  />
                </div>

                <div className="hidden sm:block text-left pr-1">
                  <div className="text-xs font-bold text-slate-900 max-w-[120px] truncate leading-tight">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-slate-500 flex items-center gap-1 font-medium">
                    {currentUser.role === 'admin' ? (
                      <span className="text-blue-700 font-bold">Admin</span>
                    ) : currentUser.status === 'approved' ? (
                      <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                        <CheckCircle2 className="w-2.5 h-2.5" /> Approved
                      </span>
                    ) : currentUser.status === 'pending' ? (
                      <span className="text-amber-600 font-bold flex items-center gap-0.5">
                        <ShieldAlert className="w-2.5 h-2.5" /> Pending
                      </span>
                    ) : (
                      <span className="text-red-600 font-bold">Suspended</span>
                    )}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Profile Dropdown */}
              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-2.5 border-b border-slate-100">
                    <div className="text-xs font-bold text-slate-900">{currentUser.name}</div>
                    <div className="text-[11px] text-slate-500 truncate font-mono">{currentUser.email}</div>
                    <div className="mt-2 flex items-center gap-1.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          currentUser.role === 'admin'
                            ? 'bg-blue-100 text-blue-800'
                            : currentUser.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : currentUser.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {currentUser.role === 'admin'
                          ? 'Director / Admin'
                          : `Status: ${currentUser.status.toUpperCase()}`}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                        {currentUser.assignedClass}
                      </span>
                    </div>

                    {currentUser.status === 'pending' && (
                      <div className="mt-2 text-[10px] bg-amber-50 text-amber-800 p-2 rounded-lg border border-amber-200">
                        Awaiting Admin Approval before accessing protected notes.
                      </div>
                    )}
                  </div>

                  <div className="py-1 text-xs">
                    <button
                      onClick={() => {
                        setCurrentTab('enrolled');
                        setProfileMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                    >
                      <Layers className="w-4 h-4 text-blue-600" />
                      <span>My Enrolled Courses ({currentUser.enrolledCourseIds.length})</span>
                    </button>

                    <button
                      onClick={() => {
                        setCurrentTab('profile');
                        setProfileMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                    >
                      <User className="w-4 h-4 text-blue-600" />
                      <span>Student Profile</span>
                    </button>

                    {currentUser.role === 'admin' && (
                      <button
                        onClick={() => {
                          setCurrentTab('admin');
                          setProfileMenuOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-blue-700 hover:bg-blue-50 flex items-center gap-2 font-bold"
                      >
                        <Shield className="w-4 h-4 text-blue-700" />
                        <span>Admin Management Dashboard</span>
                      </button>
                    )}
                  </div>

                  <div className="pt-1 border-t border-slate-100">
                    <button
                      onClick={() => {
                        logout();
                        setProfileMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  setAuthModalMode('login');
                  setAuthModalOpen(true);
                }}
                className="px-3 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-50 rounded-lg transition"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setAuthModalMode('register');
                  setAuthModalOpen(true);
                }}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm transition"
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Search Bar Expansion */}
      {mobileSearchOpen && (
        <div className="lg:hidden px-3 pb-3 border-t border-slate-100 bg-slate-50 pt-2 animate-in slide-in-from-top-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              autoFocus
              placeholder="Search class, subject, notes, or course..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 p-0.5 text-slate-400"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
