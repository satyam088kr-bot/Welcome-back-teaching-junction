import React from 'react';
import { BookOpen, FileText, Home, Layers, Radio, Shield, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TabType } from '../../types';

export const MobileNav: React.FC = () => {
  const { currentTab, setCurrentTab, currentUser, setAuthModalOpen, liveClasses } = useApp();

  const hasLiveNow = liveClasses.some((c) => c.status === 'live_now');

  const tabs: { id: TabType; label: string; icon: React.ReactNode; isLive?: boolean }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { id: 'free_courses', label: 'Courses', icon: <Layers className="w-5 h-5" /> },
    {
      id: 'live_classes',
      label: 'Live',
      icon: (
        <div className="relative">
          <Radio className={`w-5 h-5 ${hasLiveNow ? 'text-red-600 animate-pulse' : ''}`} />
          {hasLiveNow && (
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-600 animate-ping" />
          )}
        </div>
      ),
      isLive: hasLiveNow,
    },
    { id: 'materials', label: 'PDF Notes', icon: <FileText className="w-5 h-5" /> },
    { id: 'enrolled', label: 'Learning', icon: <BookOpen className="w-5 h-5" /> },
    currentUser?.role === 'admin'
      ? { id: 'admin', label: 'Admin', icon: <Shield className="w-5 h-5 text-amber-500" /> }
      : { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
  ];

  const handleTabClick = (tabId: TabType) => {
    if ((tabId === 'enrolled' || tabId === 'profile') && !currentUser) {
      setAuthModalOpen(true);
      return;
    }
    setCurrentTab(tabId);
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200/90 shadow-lg px-2 py-1.5 flex items-center justify-around safe-area-bottom">
      {tabs.map((tab) => {
        const isActive = currentTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition select-none ${
              isActive
                ? 'text-blue-700 font-bold'
                : 'text-slate-500 hover:text-slate-800 font-medium'
            }`}
          >
            <div className={`p-1 rounded-lg ${isActive ? 'bg-blue-50 text-blue-700 scale-110' : ''} transition`}>
              {tab.icon}
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
