import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { usePermission } from '../../context/PermissionContext';
import { ROLES } from '../../utils/constants';

/**
 * Route-Level Security Guard
 * Prevents unauthorized users from navigating directly via URL to restricted pages.
 * Displays 403 Access Denied if unauthorized.
 */
export const ProtectedRoute = ({
  children,
  requiredPermission,
  requiredRole,
  adminOnly = false,
}) => {
  const { currentUser, isAuthenticated } = useAuth();
  const { hasPermission, canAccessRoute } = usePermission();
  const location = useLocation();

  // 1. Check authentication
  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Admin has universal access
  if (currentUser.role === ROLES.ADMIN) {
    return <>{children}</>;
  }

  // 3. Admin-only route check
  if (adminOnly && currentUser.role !== ROLES.ADMIN) {
    return (
      <Navigate
        to="/access-denied"
        state={{
          path: location.pathname,
          required: 'Administrator Privileges',
          userRole: currentUser.role,
          reason: 'This section is strictly restricted to System Administrators.',
        }}
        replace
      />
    );
  }

  // 4. Required Role check
  if (requiredRole && currentUser.role !== requiredRole) {
    return (
      <Navigate
        to="/access-denied"
        state={{
          path: location.pathname,
          required: `${requiredRole} Role`,
          userRole: currentUser.role,
          reason: `Requires ${requiredRole} credentials.`,
        }}
        replace
      />
    );
  }

  // 5. Explicit permission key check
  if (requiredPermission && !hasPermission(requiredPermission, currentUser.role)) {
    return (
      <Navigate
        to="/access-denied"
        state={{
          path: location.pathname,
          required: requiredPermission,
          userRole: currentUser.role,
          reason: `Your role (${currentUser.role}) lacks the required "${requiredPermission}" permission configured in Admin Settings.`,
        }}
        replace
      />
    );
  }

  // 6. Generic route mapping check
  if (!canAccessRoute(location.pathname, currentUser.role)) {
    return (
      <Navigate
        to="/access-denied"
        state={{
          path: location.pathname,
          required: 'Module Access',
          userRole: currentUser.role,
          reason: `Your role does not have authorization to view this module. Contact your administrator.`,
        }}
        replace
      />
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;

