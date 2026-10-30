import React from 'react';
import { Link } from 'react-router-dom';
import { Smile, Users } from 'lucide-react';
import Button from '../../components/common/Button';

export const NotFound = () => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xl p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-500 dark:text-amber-400 mx-auto mb-5 shadow-xs">
          <Smile className="w-9 h-9" />
        </div>

        <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold mb-3">
          Error 404 • Lost in Workspace
        </span>

        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Looking for Something, Colleague?
        </h1>

        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
          The requested page does not exist or has been shifted within our human workspace.
        </p>

        <div className="mt-6 flex justify-center">
          <Link to="/dashboard">
            <Button variant="primary" size="md" icon={Users}>
              Return to Team Workspace
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

