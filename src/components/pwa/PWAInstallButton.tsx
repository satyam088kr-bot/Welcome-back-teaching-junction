import React, { useState } from 'react';
import {
  AlertCircle,
  CheckCircle,
  Download,
  Info,
  Monitor,
  Share,
  Smartphone,
  X,
} from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface Props {
  className?: string;
  variant?: 'pill' | 'header' | 'banner';
}

export const PWAInstallButton: React.FC<Props> = ({ className = '', variant = 'header' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);

  // If already running as an installed PWA, hide the button
  if (isInstalled) {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-200">
        <CheckCircle className="w-3.5 h-3.5" />
        <span>PWA Installed</span>
      </div>
    );
  }

  const handleClick = async () => {
    if (isInstallable) {
      const accepted = await install();
      if (!accepted) {
        setShowInstructionsModal(true);
      }
    } else {
      setShowInstructionsModal(true);
    }
  };

  return (
    <>
      {variant === 'banner' ? (
        <div
          className={`bg-gradient-to-r from-blue-700 to-indigo-700 text-white p-3.5 rounded-2xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${className}`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-bold text-sm">Install TJ Coaching App</div>
              <div className="text-xs text-blue-100">
                Fast mobile access, offline notes & instant notification alerts
              </div>
            </div>
          </div>
          <button
            onClick={handleClick}
            className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black shadow transition active:scale-95 shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install App</span>
          </button>
        </div>
      ) : (
        <button
          onClick={handleClick}
          className={`flex items-center gap-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-3 py-1.5 text-xs shadow-xs transition active:scale-95 ${className}`}
          title="Install Teaching Junction Coaching App on your phone or PC"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Install App</span>
        </button>
      )}

      {/* Comprehensive PWA Installation & Instructions Modal */}
      {showInstructionsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl relative border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowInstructionsModal(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Install Teaching Junction App
                </h3>
                <p className="text-xs text-slate-500">
                  Install directly on Android, iPhone, Tablet or PC
                </p>
              </div>
            </div>

            {/* Crucial Disclaimer Requirement: "Do not claim that a PWA is a native APK" */}
            <div className="rounded-2xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <strong className="font-bold">Progressive Web App (PWA):</strong> This installs directly from your browser to your home screen with zero storage bloat, instant updates, and offline note viewing. <em>It is not a compiled native Android APK package</em>.
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              {/* Android Chrome Instructions */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                  <span>On Android (Google Chrome)</span>
                </div>
                <ol className="list-decimal list-inside space-y-1 text-slate-600 pl-1">
                  <li>Tap the <strong>three dots menu (⋮)</strong> at top right corner.</li>
                  <li>Select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</li>
                  <li>Confirm by tapping <strong>"Install"</strong>. The app icon will appear on your phone home screen!</li>
                </ol>
              </div>

              {/* Desktop / Laptop Instructions */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-blue-600" />
                  <span>On Desktop / Laptop (Chrome / Edge)</span>
                </div>
                <ol className="list-decimal list-inside space-y-1 text-slate-600 pl-1">
                  <li>Look at the right side of your browser URL address bar.</li>
                  <li>Click the <strong>Install (+) icon</strong> or browser menu &gt; "Install Teaching Junction Coaching".</li>
                  <li>Launch directly from your desktop like a native application.</li>
                </ol>
              </div>

              {/* iOS Safari Instructions */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  <Share className="w-4 h-4 text-indigo-600" />
                  <span>On iPhone / iPad (Safari)</span>
                </div>
                <ol className="list-decimal list-inside space-y-1 text-slate-600 pl-1">
                  <li>Tap the <strong>Share</strong> button at bottom of Safari.</li>
                  <li>Scroll down and tap <strong>"Add to Home Screen"</strong>.</li>
                  <li>Tap <strong>"Add"</strong> in top-right corner.</li>
                </ol>
              </div>
            </div>

            <button
              onClick={() => setShowInstructionsModal(false)}
              className="w-full rounded-2xl bg-blue-700 hover:bg-blue-800 py-3 text-xs font-bold text-white transition active:scale-95 shadow-md"
            >
              Close / Got It
            </button>
          </div>
        </div>
      )}
    </>
  );
};
