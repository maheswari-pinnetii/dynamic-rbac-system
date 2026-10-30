import React from 'react';

export const Select = React.forwardRef(
  (
    {
      label,
      error,
      helperText,
      options = [],
      className = '',
      containerClassName = '',
      id,
      name,
      ...props
    },
    ref
  ) => {
    const selectId = id || name || `select_${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className={`w-full ${containerClassName}`}>
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          name={name}
          className={`block w-full rounded-xl border text-sm transition-colors duration-150 py-2.5 px-3 bg-white dark:bg-slate-900
            ${
              error
                ? 'border-rose-300 dark:border-rose-700 text-rose-900 dark:text-rose-200 focus:border-rose-500 focus:ring-rose-500'
                : 'border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500'
            }
            disabled:bg-slate-50 dark:disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed
            ${className}`}
          {...props}
        >
          {options.map((opt) => {
            const val = typeof opt === 'object' ? opt.value : opt;
            const text = typeof opt === 'object' ? opt.label : opt;
            return (
              <option key={val} value={val} className="dark:bg-slate-900 dark:text-white">
                {text}
              </option>
            );
          })}
        </select>
        {error ? (
          <p className="mt-1.5 text-xs text-rose-600 dark:text-rose-400 font-medium">{error}</p>
        ) : helperText ? (
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
