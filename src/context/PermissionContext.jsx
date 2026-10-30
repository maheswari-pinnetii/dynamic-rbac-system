import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { DEFAULT_PERMISSIONS, ROLES, PERMISSIONS, PERMISSION_DEFINITIONS } from '../utils/constants';
import { storage, STORAGE_KEYS } from '../utils/storage';

const PermissionContext = createContext(null);

export const PermissionProvider = ({ children }) => {
  // Initialize permissions from storage or fallback to defaults
  const [permissions, setPermissions] = useState(() => {
    return storage.get(STORAGE_KEYS.PERMISSIONS_MATRIX, DEFAULT_PERMISSIONS);
  });

  // Track activity logs for the dashboard audit feed
  const [activityLogs, setActivityLogs] = useState(() => {
    const saved = storage.get(STORAGE_KEYS.ACTIVITY_LOGS, null);
    if (saved && Array.isArray(saved) && saved.length > 0) return saved;

    // Default seeded activities
    return [
      {
        id: 'act_1',
        user: 'Sarah Connor (Admin)',
        role: ROLES.ADMIN,
        action: 'System Initialized',
        details: 'Dynamic RBAC policy framework initialized with enterprise defaults.',
        timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
        type: 'system',
      },
      {
        id: 'act_2',
        user: 'Marcus Vance (Manager)',
        role: ROLES.MANAGER,
        action: 'Product Catalog Synchronized',
        details: 'Retrieved 190+ records from DummyJSON public REST API.',
        timestamp: new Date(Date.now() - 1000 * 60 * 95).toISOString(),
        type: 'crud',
      },
      {
        id: 'act_3',
        user: 'Elena Rostova (Employee)',
        role: ROLES.EMPLOYEE,
        action: 'Accessed Analytics',
        details: 'Viewed inventory status distribution and monthly growth metrics.',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        type: 'access',
      },
    ];
  });

  // Sync permissions to storage on change
  useEffect(() => {
    storage.set(STORAGE_KEYS.PERMISSIONS_MATRIX, permissions);
  }, [permissions]);

  // Sync activity logs to storage
  useEffect(() => {
    storage.set(STORAGE_KEYS.ACTIVITY_LOGS, activityLogs);
  }, [activityLogs]);

  // Append a new activity to the audit feed
  const logActivity = useCallback((action, details, user = null, type = 'info') => {
    const newLog = {
      id: `act_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      user: user?.name || 'System / Anonymous',
      role: user?.role || ROLES.ADMIN,
      action,
      details,
      timestamp: new Date().toISOString(),
      type,
    };
    setActivityLogs((prev) => [newLog, ...prev.slice(0, 49)]); // keep last 50
  }, []);

  /**
   * Check if a specific role possesses a permission
   */
  const hasPermission = useCallback(
    (permissionKey, userRole) => {
      if (!userRole) return false;
      // Admin by default has absolute power over all operational features
      if (userRole === ROLES.ADMIN) {
        return true;
      }
      return !!permissions[userRole]?.[permissionKey];
    },
    [permissions]
  );

  /**
   * Map URL paths to system permissions for dynamic Route Protection and Sidebar visibility
   */
  const canAccessRoute = useCallback(
    (path, userRole) => {
      if (!userRole) return false;
      if (userRole === ROLES.ADMIN) return true;

      // Clean path
      const cleanPath = path.split('?')[0].replace(/\/$/, '') || '/';

      if (cleanPath === '/' || cleanPath === '/dashboard') {
        return hasPermission(PERMISSIONS.DASHBOARD, userRole);
      }
      if (cleanPath === '/analytics') {
        return hasPermission(PERMISSIONS.ANALYTICS, userRole);
      }
      if (cleanPath.startsWith('/products')) {
        return hasPermission(PERMISSIONS.VIEW_RECORDS, userRole);
      }
      if (cleanPath === '/reports') {
        return hasPermission(PERMISSIONS.REPORTS, userRole);
      }
      if (cleanPath.startsWith('/admin')) {
        // Admin settings: must have SETTINGS permission
        return hasPermission(PERMISSIONS.SETTINGS, userRole);
      }
      if (cleanPath === '/profile') {
        return hasPermission(PERMISSIONS.PROFILE, userRole);
      }

      return true;
    },
    [hasPermission]
  );

  /**
   * Update a single permission cell in the matrix
   */
  const updateSinglePermission = useCallback((role, permissionKey, isAllowed, user = null) => {
    setPermissions((prev) => {
      const updated = {
        ...prev,
        [role]: {
          ...prev[role],
          [permissionKey]: isAllowed,
        },
      };
      return updated;
    });

    logActivity(
      'Permission Modified',
      `${role} permission for "${permissionKey}" was ${isAllowed ? 'GRANTED' : 'REVOKED'}.`,
      user,
      'security'
    );
  }, [logActivity]);

  /**
   * Save entire modified matrix at once (Module 5 requirement: "After clicking Save, the updated permissions should immediately apply")
   */
  const savePermissionsMatrix = useCallback((newMatrix, user = null) => {
    setPermissions(newMatrix);
    storage.set(STORAGE_KEYS.PERMISSIONS_MATRIX, newMatrix);

    logActivity(
      'Permission Matrix Saved',
      'Dynamic access control matrix updated and persisted for all roles.',
      user,
      'security'
    );
  }, [logActivity]);

  /**
   * Reset all permissions to standard default baseline
   */
  const resetToDefaults = useCallback((user = null) => {
    setPermissions(DEFAULT_PERMISSIONS);
    storage.set(STORAGE_KEYS.PERMISSIONS_MATRIX, DEFAULT_PERMISSIONS);

    logActivity(
      'Permissions Reset',
      'All role permissions reverted to baseline enterprise specifications.',
      user,
      'security'
    );
  }, [logActivity]);

  return (
    <PermissionContext.Provider
      value={{
        permissions,
        hasPermission,
        canAccessRoute,
        updateSinglePermission,
        savePermissionsMatrix,
        resetToDefaults,
        activityLogs,
        logActivity,
        permissionDefinitions: PERMISSION_DEFINITIONS,
      }}
    >
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermission = () => {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error('usePermission must be used within a PermissionProvider');
  }
  return context;
};

export default PermissionContext;

