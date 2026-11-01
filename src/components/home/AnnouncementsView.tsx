import React from 'react';
import { Calendar, Megaphone, ShieldAlert, Sparkles, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AnnouncementsView: React.FC = () => {
  const { announcements } = useApp();

  const categoryColors: Record<string, string> = {
    batch: 'bg-emerald-100 text-emerald-800',
    exam: 'bg-blue-100 text-blue-800',
    holiday: 'bg-amber-100 text-amber-800',
    general: 'bg-slate-100 text-slate-800',
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Official Coaching Board</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-black">
            Notices, Circulars & Announcements
          </h1>
          <p className="text-xs sm:text-sm text-blue-100">
            Stay updated with test schedules, admission notifications, holiday circulars, and board examination advice from Teaching Junction Coaching.
          </p>
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.map((ann) => (
          <div
            key={ann.id}
            className={`bg-white rounded-2xl border p-5 sm:p-6 shadow-sm transition hover:shadow-md space-y-3 ${
              ann.urgent ? 'border-amber-300 bg-amber-50/20' : 'border-slate-200/90'
            }`}
          >
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                    categoryColors[ann.category] || 'bg-slate-100 text-slate-800'
                  }`}
                >
                  {ann.category}
                </span>
                {ann.urgent && (
                  <span className="text-[10px] font-bold bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3" />
                    IMPORTANT
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Calendar className="w-3.5 h-3.5" />
                <span>{ann.date}</span>
              </div>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              {ann.title}
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {ann.content}
            </p>

            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Published by: <strong>{ann.author}</strong></span>
              <span>Teaching Junction Coaching Notice Board</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
