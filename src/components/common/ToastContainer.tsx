import React from 'react';
import { AlertCircle, CheckCircle, Info, ShieldAlert, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const icon =
          toast.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
          ) : toast.type === 'error' ? (
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          ) : toast.type === 'warning' ? (
            <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0" />
          ) : (
            <Info className="w-5 h-5 text-blue-500 shrink-0" />
          );

        const borderBg =
          toast.type === 'success'
            ? 'border-emerald-200 bg-white'
            : toast.type === 'error'
            ? 'border-red-200 bg-white'
            : toast.type === 'warning'
            ? 'border-amber-200 bg-white'
            : 'border-blue-200 bg-white';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-xl border shadow-xl flex items-start gap-3 transition-all animate-in slide-in-from-right-5 duration-200 ${borderBg}`}
          >
            {icon}
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-slate-900">{toast.title}</div>
              {toast.message && (
                <div className="text-[11px] text-slate-600 mt-0.5 leading-snug">{toast.message}</div>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
