import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Menu,
  UserX,
  User,
  Crown,
  ChevronDown,
  Sparkles,
  Smile,
  Heart,
  Fingerprint,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usePermission } from '../../context/PermissionContext';
import { useTheme } from '../../context/ThemeContext';
import { ROLES, PERMISSIONS, ROLE_HUMAN_TITLES } from '../../utils/constants';
import { getHumanGreeting } from '../../utils/formatters';
import Badge from '../common/Badge';
import ThemeToggle from '../common/ThemeToggle';

export const Header = ({ onMenuClick }) => {
  const { currentUser, logout } = useAuth();
  const { hasPermission } = usePermission();
  const { humanThemeName } = useTheme();
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/logout');
  };

  const userRole = currentUser?.role || ROLES.EMPLOYEE;
  const humanRoleTitle = ROLE_HUMAN_TITLES[userRole] || 'Team Specialist';
  const canAccessSettings = userRole === ROLES.ADMIN || hasPermission(PERMISSIONS.SETTINGS, userRole);
  const greeting = getHumanGreeting();
  const firstName = currentUser?.name ? currentUser.name.split(' ')[0] : 'Colleague';

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200/90 dark:border-slate-800 px-4 sm:px-6 h-16 flex items-center justify-between transition-colors duration-200">
      {/* Left side: Hamburger button + Warm Greeting */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
            {greeting}, {firstName}! 👋
          </span>
          <span className="hidden md:inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Active Session
          </span>
        </div>
      </div>

      {/* Right side: Human Theme indicator + Toggle + Role badge & User Profile Dropdown */}
      <div className="flex items-center gap-2.5 sm:gap-3" ref={dropdownRef}>
        {/* Human Theme Pill */}
        <div className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 rounded-xl border border-amber-200/80 dark:border-amber-900 shadow-2xs">
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          <span>Human Theme</span>
        </div>

        {/* Human Theme Mode Switcher */}
        <ThemeToggle size="md" />

        {/* Quick shortcut to Admin Settings for Admin */}
        {canAccessSettings && (
          <Link
            to="/admin/settings"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 dark:hover:bg-purple-900/80 rounded-xl border border-purple-200 dark:border-purple-800 transition-colors"
          >
            <Crown className="w-3.5 h-3.5" />
            <span>Colleague Permissions</span>
          </Link>
        )}

        {/* User profile dropdown trigger */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
          >
            <div className="relative">
              <img
                src={
                  currentUser?.avatar ||
                  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80'
                }
                alt={currentUser?.name || 'User avatar'}
                className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 object-cover bg-slate-100"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border border-white dark:border-slate-900 rounded-full" />
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                {currentUser?.name || 'Guest Colleague'}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                {humanRoleTitle}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {/* Profile Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 text-xs text-slate-700 dark:text-slate-300 animate-in fade-in slide-in-from-top-2">
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                <p className="font-bold text-slate-900 dark:text-white truncate">
                  {currentUser?.name}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                  {currentUser?.email}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <Badge role={userRole} size="sm" dot />
                  <span className="text-[10px] text-slate-400 font-medium">
                    {currentUser?.department}
                  </span>
                </div>
              </div>

              <div className="py-1">
                <Link
                  to="/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  <span>My Identity & Passkeys</span>
                </Link>

                {canAccessSettings && (
                  <Link
                    to="/admin/settings"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-purple-700 dark:text-purple-400 font-medium"
                  >
                    <Crown className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span>Manage Colleague Access</span>
                  </Link>
                )}
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-medium text-left"
                >
                  <UserX className="w-4 h-4 text-rose-500" />
                  <span>Sign Out of Session</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
