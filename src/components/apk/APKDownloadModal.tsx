import React, { useState } from 'react';
import {
  AlertCircle,
  CheckCircle,
  Copy,
  Download,
  ExternalLink,
  Info,
  MessageCircle,
  QrCode,
  Share2,
  ShieldCheck,
  Smartphone,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const APKDownloadModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { contactInfo, addToast } = useApp();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // The direct APK download link on this domain
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const apkDownloadUrl = `${origin}/downloads/TeachingJunctionCoaching.apk`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(apkDownloadUrl);
    setCopied(true);
    addToast({
      type: 'success',
      title: 'Link Copied',
      message: 'APK download link copied to clipboard. Share it with your students!',
    });
    setTimeout(() => setCopied(false), 3000);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `नमस्ते! Teaching Junction Coaching का ऑफिशियल Android App डाउनलोड करें:\n${apkDownloadUrl}\n\nनिदेशक: ${contactInfo.directorName}\nकक्षा 6वीं से 12वीं एवं प्रतियोगी परीक्षाओं के लिए बेस्ट कोचिंग प्लेटफॉर्म।`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 relative max-h-[92vh] flex flex-col">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-white/70 hover:text-white rounded-xl hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-lg">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-white/20 text-amber-300">
                Official Android Release
              </span>
              <h2 className="text-lg sm:text-xl font-black mt-1">
                Download Teaching Junction APK
              </h2>
              <p className="text-xs text-blue-200">
                Native Android App for Mobile & Tablet (v1.0.0)
              </p>
            </div>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-slate-700">
          {/* Main Action Buttons */}
          <div className="space-y-3">
            {/* Direct APK Download Button */}
            <a
              href="/downloads/TeachingJunctionCoaching.apk"
              download="TeachingJunctionCoaching.apk"
              className="w-full py-3.5 px-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-amber-400/25 transition active:scale-95"
            >
              <Download className="w-5 h-5" />
              <span>Download APK File (Direct .apk)</span>
            </a>

            {/* Share on WhatsApp Button */}
            <button
              onClick={handleShareWhatsApp}
              className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Share APK Link with Students on WhatsApp</span>
            </button>
          </div>

          {/* Shareable Link Box */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-900">
              Direct Shareable APK URL:
            </label>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-2 rounded-xl text-xs">
              <input
                type="text"
                readOnly
                value={apkDownloadUrl}
                className="flex-1 bg-transparent border-none text-slate-800 font-mono text-[11px] outline-none truncate"
              />
              <button
                onClick={handleCopyLink}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1 shrink-0 transition"
              >
                {copied ? <CheckCircle className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Trust & Security Verification */}
          <div className="rounded-2xl bg-blue-50 border border-blue-100 p-3.5 text-xs text-blue-900 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-blue-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% Verified Coaching Application</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Connects directly to the official <strong>Teaching Junction Coaching</strong> database. Student courses, live classes, and approval status remain synchronized between the Web Portal and Android App.
            </p>
          </div>

          {/* Simple Hindi Installation Guide for Students */}
          <div className="space-y-2 border-t border-slate-200 pt-4 text-xs">
            <h4 className="font-bold text-slate-900 flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-600" />
              <span>छात्रों के लिए APK इंस्टॉल करने के 3 आसान स्टेप्स:</span>
            </h4>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-600 pl-1">
              <li>
                <strong>"Download APK File"</strong> पर क्लिक करें और फाइल डाउनलोड होने दें।
              </li>
              <li>
                फोन के Notification या <strong>Downloads फोल्डर</strong> में जाकर <code className="bg-slate-100 px-1 py-0.5 rounded text-blue-700 font-mono">TeachingJunctionCoaching.apk</code> पर टैप करें।
              </li>
              <li>
                यदि फोन में <em>"Install unknown apps"</em> या <em>"Unknown sources"</em> का मैसेज आए, तो Settings में जाकर <strong>"Allow from this source"</strong> को ON करें और <strong>"Install"</strong> दबाएं।
              </li>
            </ol>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
