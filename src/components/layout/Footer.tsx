import React from 'react';
import {
  BookOpen,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Shield,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ALL_CLASSES } from '../../data/mockData';

export const Footer: React.FC = () => {
  const { setCurrentTab, setSelectedClass, currentUser, contactInfo } = useApp();

  return (
    <footer className="bg-slate-950 text-white pt-12 pb-24 md:pb-12 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand & Bio */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                <GraduationCap className="w-6 h-6 text-amber-300" />
              </div>
              <div>
                <span className="font-black text-base tracking-tight text-white">
                  Teaching Junction
                </span>
                <span className="block text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                  Coaching Institute
                </span>
              </div>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed">
              Empowering students with foundation lectures, live interactive doubt-solving, handwritten PDF notes, NCERT solutions, and board examination guidance for Classes 6th to 12th & Competitive exams.
            </p>

            <div className="text-[11px] text-slate-400 font-medium pt-1">
              "ज्ञानं परमं ध्येयम् — Knowledge is the Supreme Goal"
            </div>
          </div>

          {/* Target Classes */}
          <div>
            <h4 className="font-bold text-sm text-white mb-3 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-blue-400" />
              <span>Classes & Batches</span>
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              {ALL_CLASSES.slice(0, 6).map((cls) => (
                <li key={cls}>
                  <button
                    onClick={() => {
                      setSelectedClass(cls);
                      setCurrentTab('free_courses');
                    }}
                    className="hover:text-blue-400 transition"
                  >
                    {cls} Foundation Batch
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => {
                    setSelectedClass('Competitive Exams');
                    setCurrentTab('free_courses');
                  }}
                  className="hover:text-blue-400 transition font-bold text-amber-300"
                >
                  Competitive Exams Wing
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Study Resources */}
          <div>
            <h4 className="font-bold text-sm text-white mb-3">Study Resources</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button
                  onClick={() => setCurrentTab('live_classes')}
                  className="hover:text-blue-400 transition text-red-400 font-semibold"
                >
                  🔴 Live Classrooms & Doubts
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('free_courses')}
                  className="hover:text-blue-400 transition"
                >
                  Free NCERT Video Lectures
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('materials')}
                  className="hover:text-blue-400 transition"
                >
                  Handwritten PDF Notes
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('materials')}
                  className="hover:text-blue-400 transition"
                >
                  Formula Handbooks & Charts
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('contact')}
                  className="hover:text-blue-400 transition text-blue-300 font-medium"
                >
                  Contact & Admission Inquiry
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('admin')}
                  className="hover:text-amber-400 text-slate-300 font-semibold transition flex items-center gap-1"
                >
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                  <span>Admin & Faculty Portal</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Coaching Office Contact (Dynamic) */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-white mb-3">Coaching Contact</h4>
            <div className="space-y-2.5 text-slate-400 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{contactInfo.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={`tel:${contactInfo.phone.replace(/[^0-9]/g, '')}`} className="hover:text-white">
                  Helpline: {contactInfo.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <a href={`mailto:${contactInfo.email}`} className="font-mono hover:text-white">
                  {contactInfo.email}
                </a>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-[11px] text-slate-400">
              <span className="font-bold text-white block">Lead Faculty:</span>
              {contactInfo.directorName}
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} Teaching Junction Coaching. All rights reserved. Directed by Er. Satyam Kumar.
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Terms of Service</span>
            <span>•</span>
            <span>Privacy Policy</span>
            <span>•</span>
            <span>PWA Enabled</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
