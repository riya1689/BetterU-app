import React, { createContext, useState, useContext } from 'react';

// Define the color palettes for both themes
const lightTheme = {
  background: '#f0f4f8',
  card: '#ffffff',
  text: '#1f2937',
  primary: '#1e3a8a',
  secondaryText: '#475569',
  border: '#e5e7eb',
};

const darkTheme = {
  background: '#111827',
  card: '#1f2937',
  text: '#f9fafb',
  primary: '#60a5fa',
  secondaryText: '#9ca3af',
  border: '#374151',
};

// 1. Create the context
const ThemeContext = createContext();

// 2. Create the provider component
export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  // Select the correct theme object based on the state
  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ isDarkMode, theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 3. Create a custom hook to use the context easily
export const useTheme = () => {
  return useContext(ThemeContext);
};
