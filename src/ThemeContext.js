import React, { createContext, useState, useMemo, useContext } from 'react';
import { ThemeProvider as MUIThemeProvider, CssBaseline, GlobalStyles } from '@mui/material';
import { getTheme, fontOptions } from './theme';


const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Get saved settings from localStorage or set defaults
  const [mode, setMode] = useState(localStorage.getItem('themeMode') || 'light');
  const [palette, setPalette] = useState(localStorage.getItem('themePalette') || 'default');
  const [font, setFont] = useState(localStorage.getItem('themeFont') || 'Roboto');

  // Functions to update settings and save to localStorage
  const toggleColorMode = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    localStorage.setItem('themeMode', newMode);
  };

  const changePalette = (newPalette) => {
    setPalette(newPalette);
    localStorage.setItem('themePalette', newPalette);
  };
  
  const changeFont = (newFont) => {
    setFont(newFont);
    localStorage.setItem('themeFont', newFont);
  };

  // Re-create the theme only when settings change
  const theme = useMemo(() => getTheme(mode, palette, font), [mode, palette, font]);
  
  const globalStyles = <GlobalStyles styles={{ body: { fontFamily: fontOptions[font] } }} />;

  return (
    <ThemeContext.Provider value={{ mode, toggleColorMode, changePalette, changeFont, palette, font }}>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        {globalStyles}
        {children}
      </MUIThemeProvider>
    </ThemeContext.Provider>
  );
};

// Custom hook to easily use the context
export const useThemeContext = () => useContext(ThemeContext);