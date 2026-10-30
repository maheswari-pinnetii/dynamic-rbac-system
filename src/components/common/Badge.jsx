import React from 'react';
import { ROLES, ROLE_BADGE_COLORS } from '../../utils/constants';

export const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  role = null,
  className = '',
}) => {
  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-0.8 gap-1.5 font-semibold',
    lg: 'text-sm px-3 py-1 gap-2 font-semibold',
  };

  if (role) {
    const roleColors = {
      [ROLES.ADMIN]: {
        badge: 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800',
        dot: 'bg-purple-600 dark:bg-purple-400',
      },
      [ROLES.MANAGER]: {
        badge: 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800',
        dot: 'bg-blue-600 dark:bg-blue-400',
      },
      [ROLES.EMPLOYEE]: {
        badge: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
        dot: 'bg-emerald-600 dark:bg-emerald-400',
      },
    }[role] || {
      badge: 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
      dot: 'bg-slate-600 dark:bg-slate-400',
    };

    return (
      <span
        className={`inline-flex items-center rounded-full border ${roleColors.badge} ${sizeStyles[size]} ${className}`}
      >
        {dot && <span className={`w-1.5 h-1.5 rounded-full ${roleColors.dot}`} />}
        {children || role}
      </span>
    );
  }

  const variantStyles = {
    default:
      'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
    primary:
      'bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border-brand-200 dark:border-brand-800',
    success:
      'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    warning:
      'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    danger:
      'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    purple:
      'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    blue:
      'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  };

  const dotColors = {
    default: 'bg-slate-500',
    primary: 'bg-brand-500',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-rose-500',
    purple: 'bg-purple-500',
    blue: 'bg-blue-500',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border ${
        variantStyles[variant] || variantStyles.default
      } ${sizeStyles[size]} ${className}`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${dotColors[variant] || dotColors.default}`}
        />
      )}
      {children}
    </span>
  );
};

export default Badge;
