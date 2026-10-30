import React from 'react';
import Badge from './Badge';

export const PageHeader = ({
  title,
  subtitle,
  badge,
  badgeVariant = 'primary',
  actions,
  breadcrumbs = [],
  className = '',
}) => {
  return (
    <div className={`mb-6 ${className}`}>
      {breadcrumbs.length > 0 && (
        <nav className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400 mb-2">
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={crumb.label || idx}>
              {idx > 0 && <span>/</span>}
              {crumb.href ? (
                <a
                  href={crumb.href}
                  className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                >
                  {crumb.label}
                </a>
              ) : (
                <span className="text-slate-700 dark:text-slate-300 font-medium">{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {title}
            </h1>
            {badge && (
              <Badge variant={badgeVariant} size="sm">
                {badge}
              </Badge>
            )}
          </div>
          {subtitle && (
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-2xl">{subtitle}</p>
          )}
        </div>

        {actions && (
          <div className="flex items-center flex-wrap gap-2.5">{actions}</div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
