'use client';
import { createContext } from 'react';

const ThemeContext = createContext({
  theme: 'dark',
  themeLoaded: false,
  toggleTheme: () => {},
});

export default ThemeContext;
