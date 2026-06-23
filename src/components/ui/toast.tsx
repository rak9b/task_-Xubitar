"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { X, CheckCircle, AlertCircle } from "lucide-react";

export type ToastType = "success" | "error" | "info";

export interface ToastMessage {
  id: string;
  title?: string;
  description: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (options: { title?: string; description: string; type?: ToastType }) => void;
  toasts: ToastMessage[];
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const toast = useCallback(({ title, description, type = "info" }: { title?: string; description: string; type?: ToastType }) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, description, type }]);
    
    // Auto dismiss after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast, toasts, dismiss }}>
      {children}
      {/* Toast Portal Container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none p-4">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 w-full p-4 rounded-xl border shadow-lg transition-all duration-300 transform translate-y-0 animate-in slide-in-from-bottom-5 ${
              t.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                : t.type === "error"
                ? "bg-rose-50 border-rose-200 text-rose-900"
                : "bg-white border-neutral-200 text-neutral-900"
            }`}
            role="alert"
          >
            {t.type === "success" && <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />}
            {t.type === "error" && <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />}
            
            <div className="flex-1">
              {t.title && <h4 className="font-semibold text-sm">{t.title}</h4>}
              <p className="text-xs opacity-90 mt-0.5">{t.description}</p>
            </div>
            
            <button
              onClick={() => dismiss(t.id)}
              className="text-neutral-400 hover:text-neutral-600 transition-colors rounded p-0.5 hover:bg-black/5 shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
