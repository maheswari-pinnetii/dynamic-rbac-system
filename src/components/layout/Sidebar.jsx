import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Users,
  Smile,
  HeartHandshake,
  Award,
  Crown,
  UserCheck,
  ChevronRight,
  Sparkles,
  Heart,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usePermission } from '../../context/PermissionContext';
import { PERMISSIONS, ROLES, ROLE_HUMAN_TITLES } from '../../utils/constants';
import Badge from '../common/Badge';

export const Sidebar = ({ isOpen, onClose }) => {
  const { currentUser } = useAuth();
  const { hasPermission } = usePermission();

  const userRole = currentUser?.role || ROLES.EMPLOYEE;
  const humanRoleTitle = ROLE_HUMAN_TITLES[userRole] || 'Team Specialist';

  // Navigation items matching exact PRD & Permission Matrix requirements
  const navItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: Users,
      permission: PERMISSIONS.DASHBOARD,
      description: 'Daily team pulse & KPIs',
      exact: true,
    },
    {
      name: 'Analytics Dashboard',
      path: '/analytics',
      icon: Smile,
      permission: PERMISSIONS.ANALYTICS,
      badge: 'Live',
      description: 'Performance & visual charts',
    },
    {
      name: 'Product Records',
      path: '/products',
      icon: HeartHandshake,
      permission: PERMISSIONS.VIEW_RECORDS,
      description: 'Curated catalog & full CRUD',
    },
    {
      name: 'Reports',
      path: '/reports',
      icon: Award,
      permission: PERMISSIONS.REPORTS,
      description: 'Valuation & CSV export',
    },
    {
      name: 'Admin Settings',
      path: '/admin/settings',
      icon: Crown,
      permission: PERMISSIONS.SETTINGS,
      adminOnly: true,
      badge: 'Admin',
      description: 'Dynamic permission matrix',
    },
    {
      name: 'Profile',
      path: '/profile',
      icon: UserCheck,
      permission: PERMISSIONS.PROFILE,
      description: 'Colleague identity & passkeys',
    },
  ];

  // Dynamic filter based on runtime RBAC permissions
  const visibleNavItems = navItems.filter((item) => {
    if (userRole === ROLES.ADMIN) return true;
    if (item.adminOnly && userRole !== ROLES.ADMIN) return false;
    return hasPermission(item.permission, userRole);
  });

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar container with full Light and Dark theme responsiveness */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } border-r border-slate-200/90 dark:border-slate-800 shadow-xl lg:shadow-none`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 via-brand-500 to-amber-400 flex items-center justify-center text-slate-950 shadow-md shadow-brand-500/20">
              <HeartHandshake className="w-5 h-5 text-slate-950" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-slate-900 dark:text-white text-base tracking-tight leading-tight flex items-center gap-1.5">
                PeopleRBAC
                <span className="text-[10px] bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 font-bold px-1.5 py-0.5 rounded border border-brand-200 dark:border-brand-800">
                  Team
                </span>
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Human Access System
              </span>
            </div>
          </div>

          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current Active Human Profile Card */}
        <div className="px-4 py-3 mx-3 my-3 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/60 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <img
                src={
                  currentUser?.avatar ||
                  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80'
                }
                alt={currentUser?.name || 'Team Colleague'}
                className="w-10 h-10 rounded-full object-cover border-2 border-brand-400 shadow-2xs"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {currentUser?.name || 'Sarah Connor'}
              </div>
              <div className="text-[11px] text-brand-700 dark:text-brand-300 truncate font-semibold">
                {humanRoleTitle}
              </div>
              <div className="mt-1 flex items-center gap-1.5">
                <Badge role={userRole} size="sm" dot />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          <div className="px-3 pt-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Workspace Modules</span>
            <span className="text-brand-600 dark:text-brand-400 font-mono text-[10px] font-bold">
              {visibleNavItems.length} of {navItems.length} Active
            </span>
          </div>

          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                onClick={() => {
                  if (window.innerWidth < 1024) onClose();
                }}
                className={({ isActive }) =>
                  `group flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-md shadow-brand-600/25 font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white font-medium'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`p-1.5 rounded-lg transition-colors flex-shrink-0 ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'text-slate-400 dark:text-slate-400 group-hover:text-brand-600 dark:group-hover:text-brand-400 group-hover:bg-brand-50 dark:group-hover:bg-brand-950/40'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col min-w-0 text-left">
                        <span className="truncate leading-tight font-semibold">
                          {item.name}
                        </span>
                        <span
                          className={`text-[10px] truncate mt-0.5 leading-tight ${
                            isActive
                              ? 'text-white/80'
                              : 'text-slate-400 dark:text-slate-500'
                          }`}
                        >
                          {item.description}
                        </span>
                      </div>
                    </div>

                    {item.badge ? (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold flex-shrink-0 ml-1.5 ${
                          isActive
                            ? 'bg-white/25 text-white'
                            : item.badge === 'Admin'
                            ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                            : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                        }`}
                      >
                        {item.badge}
                      </span>
                    ) : (
                      <ChevronRight
                        className={`w-3.5 h-3.5 flex-shrink-0 ml-1 transition-transform ${
                          isActive
                            ? 'opacity-100 translate-x-0.5'
                            : 'opacity-0 group-hover:opacity-100 text-slate-400 dark:text-slate-500'
                        }`}
                      />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Dynamic RBAC Status & Footer */}
        <div className="p-3.5 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-950/40 text-xs">
          <div className="flex items-center justify-between text-slate-700 dark:text-slate-300 font-semibold mb-1">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Dynamic RBAC</span>
            </span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
              Live Matrix
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            {userRole === ROLES.ADMIN
              ? 'You have complete governance over all system permissions.'
              : `Permissions dynamically governed by Admin for ${userRole}.`}
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
