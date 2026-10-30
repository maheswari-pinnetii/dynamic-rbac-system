import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  HeartHandshake,
  Smile,
  UserCheck,
  Sparkles,
  UserPlus,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import ThemeToggle from '../../components/common/ThemeToggle';

export const Logout = () => {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();

  // Clear session on mount if user is still logged in
  useEffect(() => {
    if (currentUser) {
      logout();
    }
  }, [currentUser, logout]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative transition-colors duration-200">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-500/10 via-transparent to-transparent pointer-events-none" />

      {/* Floating Theme Toggle */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 flex items-center gap-2">
        <ThemeToggle size="md" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0 z-10">
        <div className="bg-white dark:bg-slate-900 py-10 px-6 shadow-2xl rounded-3xl sm:px-10 border border-slate-200/90 dark:border-slate-800 text-center transition-colors">
          {/* Empathetic farewell icon */}
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-500 via-teal-500 to-amber-400 flex items-center justify-center text-slate-950 shadow-xl shadow-brand-500/20 mb-5 transform hover:scale-105 transition-transform">
            <HeartHandshake className="w-9 h-9 text-slate-950" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Session Closed Safely</span>
          </div>

          <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            See You Soon, Colleague!
          </h2>

          <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            You have safely signed out of your <strong>PeopleRBAC</strong> account. Your local authorization tokens, passkey attestations, and session cache have been cleared from this browser.
          </p>

          {/* Session Safety Summary */}
          <div className="my-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-left text-xs space-y-2">
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                Device Storage:
              </span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">Cleared & Secure</span>
            </div>
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <Smile className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                Biometric Tokens:
              </span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">Disengaged</span>
            </div>
          </div>

          {/* Quick Return Actions */}
          <div className="space-y-2.5">
            <Link to="/login" className="block w-full">
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                icon={HeartHandshake}
              >
                Sign In Again
              </Button>
            </Link>

            <Link to="/signup" className="block w-full">
              <Button
                variant="outline"
                size="md"
                className="w-full"
                icon={UserPlus}
              >
                Register New Colleague
              </Button>
            </Link>
          </div>

          <p className="mt-6 text-[11px] text-slate-400 dark:text-slate-500 flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Human Role-Based Access Control Architecture</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Logout;

