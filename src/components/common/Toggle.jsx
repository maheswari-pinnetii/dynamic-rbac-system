import React from 'react';

export const Toggle = ({
  checked = false,
  onChange,
  disabled = false,
  label,
  description,
  size = 'md',
  className = '',
}) => {
  const handleToggle = () => {
    if (!disabled && onChange) {
      onChange(!checked);
    }
  };

  const sizes = {
    sm: {
      track: 'w-8 h-4',
      thumb: 'w-3 h-3',
      translate: 'translate-x-4',
    },
    md: {
      track: 'w-11 h-6',
      thumb: 'w-4 h-4',
      translate: 'translate-x-5',
    },
    lg: {
      track: 'w-14 h-7',
      thumb: 'w-5 h-5',
      translate: 'translate-x-7',
    },
  }[size];

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={handleToggle}
        className={`relative inline-flex flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2
          ${sizes.track}
          ${checked ? 'bg-brand-600 dark:bg-brand-500' : 'bg-slate-200 dark:bg-slate-700'}
          ${disabled ? 'opacity-40 cursor-not-allowed' : ''}
        `}
      >
        <span
          className={`pointer-events-none inline-block transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
            ${sizes.thumb}
            ${checked ? sizes.translate : 'translate-x-0.5'}
            my-auto
          `}
        />
      </button>
      {(label || description) && (
        <div className="flex flex-col cursor-pointer" onClick={handleToggle}>
          {label && (
            <span
              className={`text-sm font-semibold ${
                disabled ? 'text-slate-400 dark:text-slate-600' : 'text-slate-800 dark:text-slate-200'
              }`}
            >
              {label}
            </span>
          )}
          {description && (
            <span className="text-xs text-slate-500 dark:text-slate-400">{description}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default Toggle;
