'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Check, Info, X } from 'lucide-react';

type ToastTone = 'default' | 'success' | 'error';
type ToastState = Readonly<{ id: number; message: string; tone: ToastTone }>;
type ToastContextValue = Readonly<{ showToast: (message: string, tone?: ToastTone) => void }>;

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [toast, setToast] = useState<ToastState | null>(null);
  const showToast = useCallback((message: string, tone: ToastTone = 'default') => {
    setToast({ id: Date.now(), message, tone });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timeoutId = window.setTimeout(() => setToast(null), 4200);
    return () => window.clearTimeout(timeoutId);
  }, [toast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast ? (
        <div className="pointer-events-none fixed inset-x-4 bottom-4 z-[100] flex justify-center sm:inset-x-auto sm:right-5 sm:justify-end">
          <div className="border-default-separator bg-default-surface text-default-label pointer-events-auto flex w-full max-w-md items-start gap-3 border px-4 py-3 shadow-[8px_8px_0_rgb(0_0_0_/_0.12)]" role={toast.tone === 'error' ? 'alert' : 'status'} aria-live="polite">
            <span className="bg-default-label text-default-background mt-0.5 flex size-5 shrink-0 items-center justify-center">
              {toast.tone === 'error' ? <Info size={13} aria-hidden /> : <Check size={13} aria-hidden />}
            </span>
            <p className="min-w-0 flex-1 whitespace-pre-line text-sm leading-6">{toast.message}</p>
            <button className="text-default-tertiary-label hover:text-default-label inline-flex size-6 shrink-0 items-center justify-center transition" type="button" aria-label="알림 닫기" onClick={() => setToast(null)}>
              <X size={16} aria-hidden />
            </button>
          </div>
        </div>
      ) : null}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast는 ToastProvider 안에서 사용해야 합니다.');
  return context;
}
