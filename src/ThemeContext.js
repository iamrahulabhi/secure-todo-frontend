import React, { createContext, useState, useMemo, useContext } from 'react';
import { ThemeProvider as MUIThemeProvider, CssBaseline, GlobalStyles } from '@mui/material';
import { getTheme, fontOptions } from './theme';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(localStorage.getItem('themeMode') || 'light');
  const [palette, setPalette] = useState(localStorage.getItem('themePalette') || 'default');
  const [font, setFont] = useState(localStorage.getItem('themeFont') || 'Roboto');
  const [background, setBackground] = useState(localStorage.getItem('themeBackground') || 'default');
  // --- NEW: Add state for paper background ---
  const [paperBackground, setPaperBackground] = useState(localStorage.getItem('themePaperBackground') || 'default');


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
  
  const changeBackground = (newBackground) => {
    setBackground(newBackground);
    localStorage.setItem('themeBackground', newBackground);
  };

  // --- NEW: Function to change paper background ---
  const changePaperBackground = (newPaperBackground) => {
    setPaperBackground(newPaperBackground);
    localStorage.setItem('themePaperBackground', newPaperBackground);
  };

  // --- MODIFIED: Pass paperBackground to getTheme ---
  const theme = useMemo(() => getTheme(mode, palette, font, background, paperBackground), [mode, palette, font, background, paperBackground]);
  
  const globalStyles = <GlobalStyles styles={{ body: { fontFamily: fontOptions[font] } }} />;

  // --- MODIFIED: Pass new values to the context provider ---
  return (
    <ThemeContext.Provider value={{ mode, toggleColorMode, changePalette, palette, changeFont, font, changeBackground, background, changePaperBackground, paperBackground }}>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        {globalStyles}
        {children}
      </MUIThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => useContext(ThemeContext);