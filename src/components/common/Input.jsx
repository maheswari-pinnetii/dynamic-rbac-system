import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export const Input = React.forwardRef(
  (
    {
      label,
      error,
      helperText,
      type = 'text',
      icon: Icon,
      className = '',
      containerClassName = '',
      id,
      name,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = id || name || `input_${Math.random().toString(36).substr(2, 9)}`;
    const isPassword = type === 'password';
    const computedType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className={`w-full ${containerClassName}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative rounded-xl shadow-xs">
          {Icon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Icon className="h-4 w-4" />
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            name={name}
            type={computedType}
            className={`block w-full rounded-xl border text-sm transition-colors duration-150 py-2.5 
              ${Icon ? 'pl-9' : 'pl-3.5'} 
              ${isPassword ? 'pr-10' : 'pr-3.5'}
              ${
                error
                  ? 'border-rose-300 dark:border-rose-700 text-rose-900 dark:text-rose-200 placeholder-rose-300 focus:border-rose-500 focus:ring-rose-500'
                  : 'border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-brand-500 focus:ring-1 focus:ring-brand-500'
              }
              bg-white dark:bg-slate-900 disabled:bg-slate-50 dark:disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed
              ${className}`}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none"
              tabIndex="-1"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          )}
        </div>
        {error ? (
          <p className="mt-1.5 text-xs text-rose-600 dark:text-rose-400 font-medium">{error}</p>
        ) : helperText ? (
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
