import React from 'react';
import {
  BookOpen,
  CheckCircle,
  GraduationCap,
  LogOut,
  Mail,
  Phone,
  Shield,
  ShieldAlert,
  User,
  Users,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const StudentProfileView: React.FC = () => {
  const { currentUser, logout, loginAsUser, allUsers, setAuthModalOpen } = useApp();

  if (!currentUser) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center max-w-md mx-auto my-12">
        <h2 className="text-base font-bold text-slate-800">Please Sign In</h2>
        <button
          onClick={() => setAuthModalOpen(true)}
          className="mt-4 px-5 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl shadow"
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Profile Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-800 via-blue-700 to-indigo-900 p-6 sm:p-8 text-white flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center font-black text-2xl border-2 border-white/40 shadow-inner">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black">{currentUser.name}</h1>
                <span
                  className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-2xs ${
                    currentUser.role === 'admin'
                      ? 'bg-amber-400 text-slate-950'
                      : currentUser.status === 'approved'
                      ? 'bg-emerald-400 text-slate-950'
                      : currentUser.status === 'pending'
                      ? 'bg-amber-400 text-slate-950'
                      : 'bg-red-400 text-white'
                  }`}
                >
                  {currentUser.role === 'admin' ? 'Master Admin' : currentUser.status}
                </span>
              </div>
              <div className="text-xs text-blue-100 mt-1">{currentUser.assignedClass} Student</div>
            </div>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition backdrop-blur-xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Details List */}
        <div className="p-6 sm:p-8 divide-y divide-slate-100 text-xs text-slate-700 space-y-4">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2 text-slate-500">
              <Mail className="w-4 h-4 text-slate-400" />
              <span>Email Address</span>
            </div>
            <span className="font-mono font-semibold text-slate-900">{currentUser.email}</span>
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2 text-slate-500">
              <Phone className="w-4 h-4 text-slate-400" />
              <span>Phone / WhatsApp</span>
            </div>
            <span className="font-mono font-semibold text-slate-900">{currentUser.phone}</span>
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2 text-slate-500">
              <GraduationCap className="w-4 h-4 text-slate-400" />
              <span>Assigned Target Class</span>
            </div>
            <span className="font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg">
              {currentUser.assignedClass}
            </span>
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2 text-slate-500">
              <BookOpen className="w-4 h-4 text-slate-400" />
              <span>Enrolled Courses</span>
            </div>
            <span className="font-bold text-slate-900">{currentUser.enrolledCourseIds.length} Courses</span>
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2 text-slate-500">
              <Shield className="w-4 h-4 text-slate-400" />
              <span>Registration Date</span>
            </div>
            <span className="text-slate-600">{new Date(currentUser.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Account Verification Status Deep-Dive */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Shield className="w-4 h-4 text-blue-600" />
          <span>Account Verification & Access Level</span>
        </h3>

        {currentUser.status === 'approved' || currentUser.role === 'admin' ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-900 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-sm">Full Student Access Unlocked</div>
              <p className="mt-0.5 leading-relaxed text-emerald-800">
                Your student profile is formally approved by Teaching Junction Coaching. You can read, view, and download all NCERT study materials, lecture summaries, and participate in online tests.
              </p>
            </div>
          </div>
        ) : currentUser.status === 'pending' ? (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-sm">Verification Pending (Action Required by Admin)</div>
              <p className="mt-0.5 leading-relaxed text-amber-800">
                Every newly registered student account remains in <strong>PENDING</strong> status until an authorized coaching administrator approves it.
              </p>
              <div className="mt-2 text-[11px] font-medium text-amber-900">
                You can switch to Master Admin account below to approve this account right now!
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-xs text-red-900">
            Account status is {currentUser.status}. Reason: {currentUser.rejectionReason}
          </div>
        )}
      </div>

      {/* Fast Tester Switcher Box */}
      <div className="bg-slate-50 rounded-3xl border border-slate-200 p-6 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Developer / Evaluator Quick Profile Switcher
          </h3>
          <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">
            Instant Test Mode
          </span>
        </div>
        <p className="text-xs text-slate-500">
          Switch between accounts to test how Pending vs Approved students and Admins experience the platform:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          {allUsers.slice(0, 3).map((u) => (
            <button
              key={u.id}
              onClick={() => loginAsUser(u.id)}
              className={`p-3 rounded-2xl text-left border transition ${
                currentUser.id === u.id
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                  : 'bg-white text-slate-800 border-slate-200 hover:bg-blue-50'
              }`}
            >
              <div className="font-bold text-xs truncate">{u.name}</div>
              <div className={`text-[10px] mt-0.5 ${currentUser.id === u.id ? 'text-blue-100' : 'text-slate-500'}`}>
                {u.role === 'admin' ? 'Master Admin' : `${u.status.toUpperCase()} Student`}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
