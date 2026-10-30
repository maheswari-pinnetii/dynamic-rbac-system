import React from 'react';

export const Card = ({
  children,
  title,
  subtitle,
  action,
  className = '',
  bodyClassName = 'p-5',
  headerClassName = 'px-5 py-4 border-b border-slate-100 dark:border-slate-800',
  ...props
}) => {
  return (
    <div
      className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm transition-all duration-200 ${className}`}
      {...props}
    >
      {(title || subtitle || action) && (
        <div className={`flex items-center justify-between gap-4 ${headerClassName}`}>
          <div>
            {title && (
              <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>
            )}
          </div>
          {action && <div className="flex-shrink-0">{action}</div>}
        </div>
      )}
      <div className={bodyClassName}>{children}</div>
    </div>
  );
};

export default Card;
