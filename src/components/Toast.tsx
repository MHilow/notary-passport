import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'error';
  title: string;
  description?: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  useEffect(() => {
    if (toasts.length === 0) return;
    const timer = setTimeout(() => {
      onDismiss(toasts[0].id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toasts, onDismiss]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full px-4 sm:px-0 animate-in slide-in-from-bottom-5 duration-200">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`p-4 rounded-2xl border-2 shadow-2xl flex items-start justify-between gap-3 ${
            t.type === 'success'
              ? 'bg-[#1B2A4A] text-[#F6F2E9] border-[#3F6B4F]'
              : t.type === 'error'
              ? 'bg-[#1B2A4A] text-[#F6F2E9] border-[#7A3B34]'
              : 'bg-[#1B2A4A] text-[#F6F2E9] border-[#B8924A]'
          }`}
        >
          <div className="flex items-start gap-3">
            {t.type === 'success' && <CheckCircle2 className="w-5 h-5 text-[#3F6B4F] shrink-0 mt-0.5" />}
            {t.type === 'error' && <AlertCircle className="w-5 h-5 text-[#7A3B34] shrink-0 mt-0.5" />}
            {t.type === 'info' && <Info className="w-5 h-5 text-[#B8924A] shrink-0 mt-0.5" />}
            <div>
              <h4 className="font-serif font-bold text-sm text-[#F6F2E9]">{t.title}</h4>
              {t.description && (
                <p className="text-xs font-sans text-[#F6F2E9]/80 mt-0.5 leading-relaxed">{t.description}</p>
              )}
            </div>
          </div>

          <button
            onClick={() => onDismiss(t.id)}
            className="p-1 text-[#F6F2E9]/60 hover:text-[#F6F2E9] rounded-lg hover:bg-[#14181F]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
