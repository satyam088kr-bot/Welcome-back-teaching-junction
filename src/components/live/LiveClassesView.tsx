import React, { useState } from 'react';
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  ExternalLink,
  Flame,
  GraduationCap,
  Lock,
  Play,
  Radio,
  Search,
  Shield,
  ShieldAlert,
  Sparkles,
  Users,
  Video,
  Youtube,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LiveClass, LiveClassStatus } from '../../types';

export const LiveClassesView: React.FC = () => {
  const { liveClasses, currentUser, setAuthModalOpen, addToast } = useApp();
  const [filterStatus, setFilterStatus] = useState<LiveClassStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const isApproved = currentUser?.role === 'admin' || currentUser?.status === 'approved';
  const isPending = currentUser && currentUser.status === 'pending';

  const filteredClasses = liveClasses.filter((lc) => {
    if (filterStatus !== 'all' && lc.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        lc.title.toLowerCase().includes(q) ||
        lc.teacher.toLowerCase().includes(q) ||
        lc.subject.toLowerCase().includes(q) ||
        lc.classCategory.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const liveNowCount = liveClasses.filter((c) => c.status === 'live_now').length;
  const upcomingCount = liveClasses.filter((c) => c.status === 'upcoming').length;

  const handleJoinClass = (liveClass: LiveClass) => {
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }

    if (!isApproved) {
      addToast({
        type: 'warning',
        title: 'Account Approval Required',
        message: 'Your student account is pending administrator verification before joining live interactive classrooms.',
      });
      return;
    }

    // Open real external meeting URL safely
    try {
      window.open(liveClass.meetingUrl, '_blank', 'noopener,noreferrer');
      addToast({
        type: 'info',
        title: `Joining ${liveClass.platform === 'google_meet' ? 'Google Meet' : 'YouTube Live'}`,
        message: 'Connecting to live coaching classroom in a new secure window.',
      });
    } catch (e) {
      window.location.href = liveClass.meetingUrl;
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-red-900 via-blue-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-xs font-bold">
            <Radio className="w-3.5 h-3.5 animate-pulse text-red-400" />
            <span>Interactive Live Classroom Wing</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-black tracking-tight leading-tight">
            Live Lectures, Doubt Clearing & Revision
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
            Join live audio-visual sessions conducted by <strong>Er. Satyam Kumar</strong> and senior faculty via high-definition Google Meet and YouTube Live. Direct two-way student interaction and blackboard teaching.
          </p>
        </div>
      </div>

      {/* Account Pending Warning */}
      {isPending && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 shadow-2xs">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900">
            <span className="font-bold">Student Account Verification Pending:</span> You are registered as <strong>{currentUser.name}</strong> ({currentUser.assignedClass}). To protect classroom privacy and discipline, only approved students can enter live Google Meet and Zoom rooms.
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm flex items-center justify-between gap-3 flex-wrap">
        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-semibold scrollbar-none">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-xl transition ${
              filterStatus === 'all'
                ? 'bg-slate-900 text-white font-bold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Classes ({liveClasses.length})
          </button>

          <button
            onClick={() => setFilterStatus('live_now')}
            className={`relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition ${
              filterStatus === 'live_now'
                ? 'bg-red-600 text-white font-bold shadow-sm'
                : 'bg-red-50 text-red-700 hover:bg-red-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span>Live Now ({liveNowCount})</span>
          </button>

          <button
            onClick={() => setFilterStatus('upcoming')}
            className={`px-3 py-1.5 rounded-xl transition ${
              filterStatus === 'upcoming'
                ? 'bg-blue-600 text-white font-bold shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Upcoming ({upcomingCount})
          </button>

          <button
            onClick={() => setFilterStatus('completed')}
            className={`px-3 py-1.5 rounded-xl transition ${
              filterStatus === 'completed'
                ? 'bg-slate-700 text-white font-bold shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Past Sessions
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search live topic, class or teacher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
      </div>

      {/* Live Classes Grid */}
      {filteredClasses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredClasses.map((lc) => {
            const isLive = lc.status === 'live_now';
            const isCompleted = lc.status === 'completed';

            return (
              <div
                key={lc.id}
                className={`bg-white rounded-2xl border transition-all duration-200 p-5 flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md ${
                  isLive
                    ? 'border-red-400 ring-2 ring-red-500/20 bg-gradient-to-br from-white via-white to-red-50/20'
                    : 'border-slate-200/90'
                }`}
              >
                <div>
                  {/* Top Status & Platform Row */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2">
                      {isLive ? (
                        <span className="flex items-center gap-1.5 bg-red-600 text-white font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                          <Radio className="w-3 h-3" />
                          <span>LIVE NOW</span>
                        </span>
                      ) : isCompleted ? (
                        <span className="bg-slate-100 text-slate-600 font-bold text-[10px] px-2 py-0.5 rounded-full uppercase">
                          Completed
                        </span>
                      ) : (
                        <span className="bg-blue-100 text-blue-800 font-bold text-[10px] px-2 py-0.5 rounded-full uppercase">
                          Upcoming
                        </span>
                      )}

                      <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-lg">
                        {lc.classCategory}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500">
                      {lc.platform === 'google_meet' ? (
                        <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                          <Video className="w-3 h-3" /> Google Meet
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-0.5 rounded-md">
                          <Youtube className="w-3 h-3" /> YouTube Live
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-base text-slate-900 leading-snug">
                    {lc.title}
                  </h3>

                  {/* Subject & Teacher */}
                  <div className="text-xs text-blue-700 font-semibold mt-1 flex items-center gap-2">
                    <span>{lc.subject}</span>
                    <span>•</span>
                    <span className="text-slate-600 font-normal">Faculty: {lc.teacher}</span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed line-clamp-2">
                    {lc.description}
                  </p>
                </div>

                {/* Date, Timing & Join Action */}
                <div className="pt-3 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-medium text-slate-700">{lc.date}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-bold text-slate-900">{lc.startTime}</span>
                      <span>({lc.duration})</span>
                    </div>
                  </div>

                  {/* Join Button */}
                  {isLive ? (
                    <button
                      onClick={() => handleJoinClass(lc)}
                      className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-black text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 active:scale-98 animate-bounce-subtle"
                    >
                      <Video className="w-4 h-4" />
                      <span>Join Live Class Room Now</span>
                      <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-80" />
                    </button>
                  ) : isCompleted ? (
                    <button
                      onClick={() => handleJoinClass(lc)}
                      className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>View Session Archive</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleJoinClass(lc)}
                      className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>{isApproved ? 'Open Meeting Link' : 'Join Link (Approved Students)'}</span>
                      <ExternalLink className="w-3.5 h-3.5 ml-0.5 opacity-80" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <Radio className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No Live Classes Match This Filter</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Check back soon or explore our recorded video lessons in the Free and Paid Courses tabs.
          </p>
        </div>
      )}

      {/* Safety & Meeting Guidelines */}
      <div className="bg-slate-100 rounded-2xl p-4 sm:p-5 text-xs text-slate-600 space-y-1.5 border border-slate-200">
        <div className="font-bold text-slate-900 flex items-center gap-1.5">
          <Shield className="w-4 h-4 text-blue-700" />
          <span>Coaching Live Class Etiquette & Instructions</span>
        </div>
        <p className="leading-relaxed">
          1. Please keep your microphone muted upon entry unless invited by the teacher to ask a doubt.<br />
          2. Classes utilize official Google Meet and YouTube Live streaming. For best performance, use a stable broadband or 4G/5G connection.<br />
          3. Handwritten lecture notes for every live session are uploaded to the <strong>Study Materials (PDF)</strong> tab within 2 hours after the stream concludes.
        </p>
      </div>
    </div>
  );
};
