import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#faf8f5] dark:bg-[#0b0f17] text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      <div className="flex-1 flex">
        {/* Dynamic Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
          <Header onMenuClick={() => setSidebarOpen(true)} />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            <Outlet />
          </main>

          {/* Warm human footer */}
          <footer className="border-t border-amber-100/60 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xs py-4 px-6 text-center text-xs text-slate-500 dark:text-slate-400 transition-colors duration-200">
            <p className="flex items-center justify-center gap-2 flex-wrap">
              <span className="font-bold text-amber-800 dark:text-amber-300">Human Theme Active</span>
              <span>•</span>
              <span>PeopleRBAC Dynamic Access Architecture</span>
              <span>•</span>
              <span>React Context API (Strictly No Redux)</span>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
