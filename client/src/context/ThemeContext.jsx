/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useContext } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // Persist across sessions
    return localStorage.getItem('fp-theme') || 'dark';
  });

  useEffect(() => {
    // Apply to <html> so CSS [data-theme] selectors work globally
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('fp-theme', theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme(t => (t === 'dark' ? 'light' : 'dark'));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
