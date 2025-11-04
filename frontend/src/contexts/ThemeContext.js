import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import api from '../services/api';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState({
    site_name: 'JM Online',
    primary_color: '#007bff',
    secondary_color: '#6c757d',
    logo_url: null,
  });

  const darkenColor = useCallback((color, percent) => {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
  }, []);

  const applyTheme = useCallback((themeData) => {
    const root = document.documentElement;
    
    if (themeData && themeData.primary_color) {
      root.style.setProperty('--primary-color', themeData.primary_color);
      // Calculate hover color (darker)
      const hoverColor = darkenColor(themeData.primary_color, 15);
      root.style.setProperty('--primary-color-hover', hoverColor);
    }
    
    if (themeData && themeData.secondary_color) {
      root.style.setProperty('--secondary-color', themeData.secondary_color);
    }

    // Update document title
    if (themeData && themeData.site_name) {
      document.title = `${themeData.site_name} - B2B Store`;
    }
  }, [darkenColor]);

  const loadTheme = useCallback(async () => {
    try {
      const response = await api.get('/settings');
      if (response.data) {
        setTheme(response.data);
        applyTheme(response.data);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  }, [applyTheme]);

  useEffect(() => {
    loadTheme();
  }, [loadTheme]);

  // Expose loadTheme globally for settings page
  useEffect(() => {
    window.loadTheme = loadTheme;
    return () => {
      delete window.loadTheme;
    };
  }, [loadTheme]);

  return (
    <ThemeContext.Provider value={{ theme, applyTheme, loadTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

