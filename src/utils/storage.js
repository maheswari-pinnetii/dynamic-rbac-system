/**
 * Safe Local Storage Utility with JSON serialization and defaults
 */

export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue;
      return JSON.parse(item);
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  },

  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error saving to localStorage key "${key}":`, error);
      return false;
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
      return false;
    }
  },

  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  },
};

export const STORAGE_KEYS = {
  CURRENT_USER: 'rbac_auth_user',
  USERS_LIST: 'rbac_registered_users',
  PERMISSIONS_MATRIX: 'rbac_dynamic_permissions',
  PRODUCTS_OVERRIDE: 'rbac_products_custom_store',
  LOGIN_HISTORY: 'rbac_login_history',
  ACTIVITY_LOGS: 'rbac_activity_logs',
};

