import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { DEMO_USERS, ROLES } from '../utils/constants';
import { storage, STORAGE_KEYS } from '../utils/storage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Initialize registered users list
  const [users, setUsers] = useState(() => {
    const saved = storage.get(STORAGE_KEYS.USERS_LIST, null);
    if (saved && Array.isArray(saved) && saved.length > 0) return saved;

    // Enhance demo users with pre-configured passkey support
    return DEMO_USERS.map((u) => ({
      ...u,
      hasPasskey: true,
      passkeys: [
        {
          id: `pk_${u.id}`,
          name: `${u.role} Windows Hello / Fingerprint`,
          type: 'platform',
          createdAt: u.createdAt,
        },
      ],
    }));
  });

  // Current authenticated user (default to Sarah Connor Admin for instant exploration)
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = storage.get(STORAGE_KEYS.CURRENT_USER, null);
    if (saved) return saved;
    return users[0];
  });

  // Login history tracking (Module 2: "Recent Login History")
  const [loginHistory, setLoginHistory] = useState(() => {
    const saved = storage.get(STORAGE_KEYS.LOGIN_HISTORY, null);
    if (saved && Array.isArray(saved) && saved.length > 0) return saved;
    return [
      {
        id: 'lh_1',
        userName: 'Sarah Connor',
        email: 'admin@enterprise.com',
        role: ROLES.ADMIN,
        method: 'Passkey (Windows Hello)',
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        ipAddress: '192.168.1.104',
        browser: 'Chrome 122 (Windows 11)',
        status: 'Success',
      },
      {
        id: 'lh_2',
        userName: 'Marcus Vance',
        email: 'manager@enterprise.com',
        role: ROLES.MANAGER,
        method: 'Passkey (Fingerprint)',
        timestamp: new Date(Date.now() - 1000 * 60 * 75).toISOString(),
        ipAddress: '192.168.1.182',
        browser: 'Firefox 124 (macOS)',
        status: 'Success',
      },
      {
        id: 'lh_3',
        userName: 'Elena Rostova',
        email: 'employee@enterprise.com',
        role: ROLES.EMPLOYEE,
        method: 'Password',
        timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
        ipAddress: '192.168.1.201',
        browser: 'Edge 121 (Windows 11)',
        status: 'Success',
      },
      {
        id: 'lh_4',
        userName: 'Unknown User',
        email: 'unknown@external.net',
        role: 'Unknown',
        method: 'Password',
        timestamp: new Date(Date.now() - 1000 * 60 * 400).toISOString(),
        ipAddress: '45.33.32.156',
        browser: 'Safari (iOS 17)',
        status: 'Failed (Invalid Password)',
      },
    ];
  });

  // Persist users list
  useEffect(() => {
    storage.set(STORAGE_KEYS.USERS_LIST, users);
  }, [users]);

  // Persist current user session
  useEffect(() => {
    if (currentUser) {
      storage.set(STORAGE_KEYS.CURRENT_USER, currentUser);
    } else {
      storage.remove(STORAGE_KEYS.CURRENT_USER);
    }
  }, [currentUser]);

  // Persist login history
  useEffect(() => {
    storage.set(STORAGE_KEYS.LOGIN_HISTORY, loginHistory);
  }, [loginHistory]);

  const recordLoginAttempt = (userName, email, role, status, method = 'Password') => {
    const entry = {
      id: `lh_${Date.now()}`,
      userName,
      email,
      role,
      method,
      timestamp: new Date().toISOString(),
      ipAddress: '127.0.0.1 (Local Client)',
      browser: `${navigator.userAgent.includes('Chrome') ? 'Chrome' : 'Modern Browser'} (Active)`,
      status,
    };
    setLoginHistory((prev) => [entry, ...prev.slice(0, 24)]);
  };

  /**
   * Password Login handler
   */
  const login = useCallback(
    async (email, password) => {
      await new Promise((r) => setTimeout(r, 350));

      const found = users.find(
        (u) => u.email.toLowerCase().trim() === email.toLowerCase().trim()
      );

      if (!found) {
        recordLoginAttempt('Unknown', email, 'Unknown', 'Failed (Account Not Found)', 'Password');
        throw new Error('No account found with this email address.');
      }

      if (found.password !== password) {
        recordLoginAttempt(found.name, email, found.role, 'Failed (Incorrect Password)', 'Password');
        throw new Error('Invalid password provided. Please verify credentials.');
      }

      setCurrentUser(found);
      recordLoginAttempt(found.name, found.email, found.role, 'Success', 'Password');
      return found;
    },
    [users]
  );

  /**
   * Passkey / Windows Hello / Fingerprint Login handler
   */
  const loginWithPasskey = useCallback(
    async (email, passkeyResult = {}) => {
      await new Promise((r) => setTimeout(r, 300));

      let matchedUser = null;
      if (email && email.trim()) {
        matchedUser = users.find(
          (u) => u.email.toLowerCase().trim() === email.toLowerCase().trim()
        );
      } else {
        // Discoverable flow: find by credential ID or fallback to current/admin user
        matchedUser =
          users.find((u) =>
            u.passkeys?.some((pk) => pk.id === passkeyResult.credentialId)
          ) || users[0];
      }

      if (!matchedUser) {
        recordLoginAttempt('Unknown', email || 'Passkey User', 'Unknown', 'Failed (No User Found)', 'Passkey');
        throw new Error('No matching user account found for this passkey.');
      }

      const methodLabel =
        passkeyResult.authenticatorType || 'Passkey (Windows Hello / Fingerprint)';

      setCurrentUser(matchedUser);
      recordLoginAttempt(matchedUser.name, matchedUser.email, matchedUser.role, 'Success (Passkey)', methodLabel);
      return matchedUser;
    },
    [users]
  );

  /**
   * Signup handler with Passkey or Password support
   */
  const signup = useCallback(
    async ({ name, email, password, role, passkeyData = null }) => {
      await new Promise((r) => setTimeout(r, 400));

      const normalizedEmail = email.toLowerCase().trim();
      const exists = users.some((u) => u.email.toLowerCase().trim() === normalizedEmail);

      if (exists) {
        throw new Error('An account with this email address already exists.');
      }

      const passkeysList = passkeyData
        ? [
            {
              id: passkeyData.id || `pk_${Date.now()}`,
              name: passkeyData.authenticatorType || 'Registered Passkey',
              type: 'platform',
              createdAt: new Date().toISOString(),
            },
          ]
        : [];

      const newUser = {
        id: `usr_${Date.now()}`,
        name: name.trim(),
        email: normalizedEmail,
        password: password || 'PasskeyDefault123!',
        role: role || ROLES.EMPLOYEE,
        department: 'General Operations',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name.trim())}`,
        createdAt: new Date().toISOString(),
        hasPasskey: passkeysList.length > 0,
        passkeys: passkeysList,
      };

      setUsers((prev) => [...prev, newUser]);
      setCurrentUser(newUser);

      const authMethodUsed = passkeyData ? 'Passkey Registration' : 'Password Registration';
      recordLoginAttempt(newUser.name, newUser.email, newUser.role, 'Success (Registered)', authMethodUsed);
      return newUser;
    },
    [users]
  );

  /**
   * Register a new passkey to an existing user's profile
   */
  const addPasskeyToUser = useCallback((userId, passkeyData) => {
    const newPasskey = {
      id: passkeyData.id || `pk_${Date.now()}`,
      name: passkeyData.authenticatorType || 'Windows Hello / Fingerprint Device',
      type: 'platform',
      createdAt: new Date().toISOString(),
    };

    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          return {
            ...u,
            hasPasskey: true,
            passkeys: [...(u.passkeys || []), newPasskey],
          };
        }
        return u;
      })
    );

    setCurrentUser((current) => {
      if (current && current.id === userId) {
        return {
          ...current,
          hasPasskey: true,
          passkeys: [...(current.passkeys || []), newPasskey],
        };
      }
      return current;
    });

    return newPasskey;
  }, []);

  /**
   * Logout handler
   */
  const logout = useCallback(() => {
    setCurrentUser(null);
    storage.remove(STORAGE_KEYS.CURRENT_USER);
  }, []);

  /**
   * Fast Demo Persona Switcher
   */
  const switchRole = useCallback(
    (targetRole) => {
      const matched = users.find((u) => u.role === targetRole) || {
        id: `demo_${targetRole.toLowerCase()}`,
        name: `Demo ${targetRole}`,
        email: `${targetRole.toLowerCase()}@enterprise.com`,
        role: targetRole,
        department: `${targetRole} Dept`,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${targetRole}`,
        createdAt: new Date().toISOString(),
        hasPasskey: true,
      };

      setCurrentUser(matched);
      recordLoginAttempt(matched.name, matched.email, matched.role, 'Switched Persona', 'Demo Switcher');
    },
    [users]
  );

  /**
   * Update a colleague's role (Admin Role Management)
   */
  const updateUserRole = useCallback((userId, newRole) => {
    setUsers((all) =>
      all.map((u) => {
        if (u.id === userId) {
          return { ...u, role: newRole };
        }
        return u;
      })
    );

    setCurrentUser((curr) => {
      if (curr && curr.id === userId) {
        return { ...curr, role: newRole };
      }
      return curr;
    });
  }, []);

  /**
   * Add a new colleague user (Admin User CRUD)
   */
  const addUser = useCallback(({ name, email, role, department, title }) => {
    const newUser = {
      id: `usr_${Date.now()}`,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: 'Password123!',
      role: role || ROLES.EMPLOYEE,
      department: department || 'General Operations',
      title: title || `${role} Specialist`,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name.trim())}`,
      createdAt: new Date().toISOString(),
      hasPasskey: false,
      passkeys: [],
    };

    setUsers((prev) => [...prev, newUser]);
    return newUser;
  }, []);

  /**
   * Remove a colleague user (Admin User CRUD)
   */
  const deleteUser = useCallback((userId) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
  }, []);

  /**
   * Update Profile
   */
  const updateUserProfile = useCallback((updatedFields) => {
    setCurrentUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...updatedFields };
      setUsers((all) => all.map((u) => (u.id === prev.id ? updated : u)));
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        loginHistory,
        isAuthenticated: !!currentUser,
        login,
        loginWithPasskey,
        signup,
        addPasskeyToUser,
        logout,
        switchRole,
        updateUserProfile,
        updateUserRole,
        addUser,
        deleteUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
