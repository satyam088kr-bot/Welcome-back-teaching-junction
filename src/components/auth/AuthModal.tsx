import React, { useState } from 'react';
import {
  AlertCircle,
  CheckCircle,
  GraduationCap,
  KeyRound,
  Lock,
  Mail,
  Phone,
  Shield,
  User,
  X,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ALL_CLASSES } from '../../data/mockData';
import { ClassCategory } from '../../types';

export const AuthModal: React.FC = () => {
  const {
    authModalOpen,
    setAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    registerStudent,
    loginAsUser,
    allUsers,
    currentUser,
  } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [assignedClass, setAssignedClass] = useState<ClassCategory>('Class 10th');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!authModalOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const targetEmail = email.trim().toLowerCase();
    const foundUser = allUsers.find((u) => u.email.toLowerCase() === targetEmail);

    if (!foundUser) {
      setErrorMsg('No student or staff account found with this email. Please check spelling or register below.');
      return;
    }

    loginAsUser(foundUser.id);
    setAuthModalOpen(false);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!name.trim() || !email.trim() || !phone.trim()) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    const result = registerStudent({
      name,
      email,
      phone,
      assignedClass,
      password,
    });

    if (result.success) {
      setSuccessMsg(result.message);
      setTimeout(() => {
        setAuthModalOpen(false);
      }, 2500);
    } else {
      setErrorMsg(result.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 my-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {authModalMode === 'login' ? 'Student & Staff Login' : 'Student Registration'}
              </h2>
              <div className="text-xs text-blue-200">Teaching Junction Coaching Portal</div>
            </div>
          </div>
          <button
            onClick={() => setAuthModalOpen(false)}
            className="p-1.5 text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Toggle Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setAuthModalMode('login');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-3 text-center transition ${
              authModalMode === 'login'
                ? 'bg-white text-blue-700 border-b-2 border-blue-600 font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthModalMode('register');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-3 text-center transition ${
              authModalMode === 'register'
                ? 'bg-white text-blue-700 border-b-2 border-blue-600 font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            New Student Registration
          </button>
        </div>

        <div className="p-5">
          {errorMsg && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>{errorMsg}</div>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3 rounded-xl flex items-start gap-2">
              <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <div>
                <span className="font-bold">Pending Admin Approval:</span> {successMsg}
              </div>
            </div>
          )}

          {authModalMode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    placeholder="student@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow transition"
              >
                Sign In to Portal
              </button>

              {/* Quick Demo Logins Section */}
              <div className="mt-5 pt-4 border-t border-slate-100">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Quick Demo Logins:</span>
                  <span className="text-blue-600 font-normal">Click to switch</span>
                </div>
                <div className="grid grid-cols-1 gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      loginAsUser('user-admin-1');
                      setAuthModalOpen(false);
                    }}
                    className="flex items-center justify-between p-2 rounded-lg bg-blue-50/70 hover:bg-blue-100/70 text-left border border-blue-200 transition"
                  >
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-blue-700" />
                      <div>
                        <div className="text-xs font-bold text-blue-900">Satyam Kumar (Master Admin)</div>
                        <div className="text-[10px] text-blue-700 font-mono">satyam088kr@gmail.com</div>
                      </div>
                    </div>
                    <span className="text-[10px] bg-blue-700 text-white font-bold px-2 py-0.5 rounded">
                      Admin
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      loginAsUser('user-student-approved');
                      setAuthModalOpen(false);
                    }}
                    className="flex items-center justify-between p-2 rounded-lg bg-emerald-50/70 hover:bg-emerald-100/70 text-left border border-emerald-200 transition"
                  >
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-emerald-700" />
                      <div>
                        <div className="text-xs font-bold text-emerald-900">Aarav Sharma (Approved Student)</div>
                        <div className="text-[10px] text-emerald-700">Class 10th • Full Access</div>
                      </div>
                    </div>
                    <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded">
                      Approved
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      loginAsUser('user-student-pending');
                      setAuthModalOpen(false);
                    }}
                    className="flex items-center justify-between p-2 rounded-lg bg-amber-50/70 hover:bg-amber-100/70 text-left border border-amber-200 transition"
                  >
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-amber-700" />
                      <div>
                        <div className="text-xs font-bold text-amber-900">Pooja Verma (Pending Student)</div>
                        <div className="text-[10px] text-amber-700">Class 12th • Awaiting Approval</div>
                      </div>
                    </div>
                    <span className="text-[10px] bg-amber-500 text-slate-950 font-bold px-2 py-0.5 rounded">
                      Pending
                    </span>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-2.5 text-xs text-blue-900 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <div>
                  <strong>Admin Approval Rule:</strong> All new student registrations are placed in <strong>Pending</strong> state until verified by the Director/Admin to ensure authentic student enrollments.
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Student Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priya Kumari"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    placeholder="priya@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone / WhatsApp
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="tel"
                      required
                      placeholder="+91 9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-8 pr-2.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Target Class
                  </label>
                  <select
                    value={assignedClass}
                    onChange={(e) => setAssignedClass(e.target.value as ClassCategory)}
                    className="w-full px-2.5 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    {ALL_CLASSES.map((cls) => (
                      <option key={cls} value={cls}>
                        {cls}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Create Password
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow transition mt-2"
              >
                Submit Student Registration
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
