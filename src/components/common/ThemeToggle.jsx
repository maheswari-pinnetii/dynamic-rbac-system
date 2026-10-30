import React from 'react';
import { Smile, Heart } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const ThemeToggle = ({ className = '', size = 'md', showLabel = false }) => {
  const { isDark, toggleTheme, humanThemeName } = useTheme();

  const sizeClasses = {
    sm: 'p-1.5 text-xs',
    md: 'p-2 text-sm',
    lg: 'p-2.5 text-base',
  }[size];

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }[size];

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`rounded-xl border border-amber-200/70 dark:border-slate-700 bg-amber-50/60 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-amber-800 dark:hover:text-amber-300 hover:bg-amber-100/60 dark:hover:bg-slate-700/80 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs flex items-center gap-1.5 group ${sizeClasses} ${className}`}
      title={`Human Theme: ${humanThemeName} (Click to switch)`}
      aria-label={`Human Theme: ${humanThemeName}`}
    >
      <div className="relative w-4 h-4 flex items-center justify-center">
        {isDark ? (
          <Heart className={`${iconSizes} text-rose-400 fill-rose-400/30 group-hover:scale-110 transition-transform duration-300`} />
        ) : (
          <Smile className={`${iconSizes} text-amber-500 fill-amber-500/20 group-hover:rotate-12 transition-transform duration-300`} />
        )}
      </div>
      {showLabel && (
        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200">
          {humanThemeName}
        </span>
      )}
    </button>
  );
};

export default ThemeToggle;

