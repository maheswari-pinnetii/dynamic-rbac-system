import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { usePermission } from '../../context/PermissionContext';

/**
 * Feature-Level Permission Guard
 *
 * Usage:
 * <CanAccess permission="records.create">
 *   <button>Add Product</button>
 * </CanAccess>
 *
 * Or with fallback / disabled state:
 * <CanAccess permission="records.delete" renderDisabled tooltip="Requires Admin grant">
 *   <button>Delete</button>
 * </CanAccess>
 */
export const CanAccess = ({
  permission,
  roles,
  children,
  fallback = null,
  renderDisabled = false,
  tooltip = 'Permission restricted by Admin settings',
}) => {
  const { currentUser } = useAuth();
  const { hasPermission } = usePermission();

  if (!currentUser) return fallback;

  let isAllowed = false;

  // 1. Role match check if specified
  if (roles && Array.isArray(roles)) {
    isAllowed = roles.includes(currentUser.role);
  } else if (permission) {
    // 2. Dynamic permission check
    isAllowed = hasPermission(permission, currentUser.role);
  } else {
    isAllowed = true;
  }

  if (isAllowed) {
    return <>{children}</>;
  }

  if (renderDisabled && React.isValidElement(children)) {
    return (
      <div className="relative inline-block group" title={tooltip}>
        {React.cloneElement(children, {
          disabled: true,
          className: `${children.props.className || ''} opacity-40 cursor-not-allowed pointer-events-none`,
        })}
      </div>
    );
  }

  return fallback;
};

export default CanAccess;

