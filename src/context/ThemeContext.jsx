import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext(null);
const THEME_STORAGE_KEY = 'rbac_theme';

export const ThemeProvider = ({ children }) => {
  // Stored mode: 'light' | 'dark' | 'system'
  const [theme, setThemeState] = useState(() => {
    try {
      return localStorage.getItem(THEME_STORAGE_KEY) || 'system';
    } catch {
      return 'system';
    }
  });

  // Calculate whether dark mode should be applied right now
  const [isDark, setIsDark] = useState(() => {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY) || 'system';
      if (stored === 'dark') return true;
      if (stored === 'light') return false;
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  const applyThemeToDOM = useCallback((currentTheme) => {
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark =
      currentTheme === 'dark' || (currentTheme === 'system' && systemPrefersDark);

    setIsDark(shouldBeDark);

    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
      const meta = document.querySelector('meta[name="color-scheme"]');
      if (meta) meta.content = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      const meta = document.querySelector('meta[name="color-scheme"]');
      if (meta) meta.content = 'light';
    }
  }, []);

  const setTheme = useCallback(
    (newTheme) => {
      setThemeState(newTheme);
      try {
        if (newTheme === 'system') {
          localStorage.removeItem(THEME_STORAGE_KEY);
        } else {
          localStorage.setItem(THEME_STORAGE_KEY, newTheme);
        }
      } catch (err) {
        console.warn('Could not persist theme to localStorage:', err);
      }
      applyThemeToDOM(newTheme);
    },
    [applyThemeToDOM]
  );

  const toggleTheme = useCallback(() => {
    const nextTheme = isDark ? 'light' : 'dark';
    setTheme(nextTheme);
  }, [isDark, setTheme]);

  // Sync with OS preference changes when in 'system' mode
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = () => {
      if (theme === 'system') {
        applyThemeToDOM('system');
      }
    };

    mediaQuery.addEventListener('change', handleSystemChange);
    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, [theme, applyThemeToDOM]);

  // Sync across browser tabs via storage event
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === THEME_STORAGE_KEY) {
        const externalTheme = e.newValue || 'system';
        setThemeState(externalTheme);
        applyThemeToDOM(externalTheme);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [applyThemeToDOM]);

  // Apply on mount
  useEffect(() => {
    applyThemeToDOM(theme);
  }, [theme, applyThemeToDOM]);

  const humanThemeName = isDark ? 'Human Warm Twilight' : 'Human Warm Daylight';

  return (
    <ThemeContext.Provider value={{ theme, isDark, setTheme, toggleTheme, humanThemeName, isHumanTheme: true }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;

