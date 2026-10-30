import React, { createContext, useContext, useState, useCallback } from 'react';
import { Smile, Heart, Eye, HeartHandshake, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    ({ title, message, type = 'info', duration = 4000 }) => {
      const id = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const newToast = { id, title, message, type, duration };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
      return id;
    },
    [removeToast]
  );

  const success = useCallback(
    (message, title = 'Success') => addToast({ title, message, type: 'success' }),
    [addToast]
  );

  const error = useCallback(
    (message, title = 'Notice') => addToast({ title, message, type: 'error', duration: 5000 }),
    [addToast]
  );

  const warning = useCallback(
    (message, title = 'Heads Up') => addToast({ title, message, type: 'warning' }),
    [addToast]
  );

  const info = useCallback(
    (message, title = 'Colleague Update') => addToast({ title, message, type: 'info' }),
    [addToast]
  );

  return (
    <ToastContext.Provider value={{ addToast, removeToast, success, error, warning, info }}>
      {children}

      {/* Toast Notification Container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col space-y-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => {
          const config = {
            success: {
              icon: Smile,
              bg: 'bg-white dark:bg-slate-900 border-emerald-200 dark:border-emerald-800 text-slate-800 dark:text-slate-100 shadow-xl shadow-emerald-500/10',
              iconColor: 'text-emerald-600 dark:text-emerald-400',
            },
            error: {
              icon: Heart,
              bg: 'bg-white dark:bg-slate-900 border-rose-200 dark:border-rose-800 text-slate-800 dark:text-slate-100 shadow-xl shadow-rose-500/10',
              iconColor: 'text-rose-600 dark:text-rose-400',
            },
            warning: {
              icon: Eye,
              bg: 'bg-white dark:bg-slate-900 border-amber-200 dark:border-amber-800 text-slate-800 dark:text-slate-100 shadow-xl shadow-amber-500/10',
              iconColor: 'text-amber-600 dark:text-amber-400',
            },
            info: {
              icon: HeartHandshake,
              bg: 'bg-white dark:bg-slate-900 border-blue-200 dark:border-blue-800 text-slate-800 dark:text-slate-100 shadow-xl shadow-blue-500/10',
              iconColor: 'text-blue-600 dark:text-blue-400',
            },
          }[toast.type] || {
            icon: HeartHandshake,
            bg: 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 shadow-xl',
            iconColor: 'text-slate-600 dark:text-slate-400',
          };

          const IconComponent = config.icon;

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start p-4 border rounded-2xl transition-all duration-300 animate-slide-in ${config.bg}`}
              role="alert"
            >
              <div className="flex-shrink-0 mr-3 mt-0.5">
                <IconComponent className={`w-5 h-5 ${config.iconColor}`} />
              </div>
              <div className="flex-1 min-w-0 mr-2">
                {toast.title && (
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {toast.title}
                  </h4>
                )}
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed break-words">
                  {toast.message}
                </p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="flex-shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
                aria-label="Close toast"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default ToastContext;
