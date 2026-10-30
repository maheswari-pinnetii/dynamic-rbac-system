import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
  HeartHandshake,
  Users,
  Crown,
  Smile,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ROLES, ROLE_HUMAN_TITLES, DEMO_USERS } from '../../utils/constants';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

export const AccessDenied = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, switchRole } = useAuth();

  const state = location.state || {};
  const attemptedPath = state.path || 'this workspace module';
  const required = state.required || 'Executive Administrator Access';
  const userRole = state.userRole || currentUser?.role || ROLES.EMPLOYEE;
  const humanRole = ROLE_HUMAN_TITLES[userRole] || 'Team Specialist';
  const reason =
    state.reason ||
    'Your current role does not have authorization to view this section based on policies set by the Admin in the Permission Matrix.';

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-2xl p-8 text-center">
        {/* Human Empathetic Icon */}
        <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400 mx-auto mb-4 shadow-xs">
          <HeartHandshake className="w-8 h-8" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-bold mb-3">
          <span>Notice 403</span>
          <span>•</span>
          <span>Permission Required</span>
        </div>

        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Hold on, Colleague!
        </h1>

        <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
          {reason}
        </p>

        {/* Human Context Box */}
        <div className="mt-5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-left text-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Your Role:</span>
            <div className="flex items-center gap-1.5">
              <Badge role={userRole} size="sm" dot />
              <span className="font-bold text-slate-800 dark:text-slate-200">({humanRole})</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Attempted Section:</span>
            <code className="text-slate-800 dark:text-slate-200 font-mono text-[11px] bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded-md">
              {attemptedPath}
            </code>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Governing Policy:</span>
            <span className="font-bold text-purple-700 dark:text-purple-400">{required}</span>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            variant="outline"
            size="md"
            icon={Smile}
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto"
          >
            Go Back
          </Button>

          <Link to="/dashboard" className="w-full sm:w-auto">
            <Button
              variant="primary"
              size="md"
              icon={Users}
              className="w-full sm:w-auto"
            >
              Back to Team Workspace
            </Button>
          </Link>
        </div>

        {/* Colleague testing shortcut */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
          <span>Evaluating the RBAC System? </span>
          <button
            type="button"
            onClick={() => {
              switchRole(ROLES.ADMIN);
              navigate('/admin/settings');
            }}
            className="text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 font-bold underline inline-flex items-center gap-1"
          >
            Switch to Sarah (Admin) to adjust permissions
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;
