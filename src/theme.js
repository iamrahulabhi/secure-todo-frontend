import { createTheme } from '@mui/material/styles';

// Define your color palettes
const palettes = {
  default: {
    primary: { main: '#1976d2' }, // MUI default blue
    secondary: { main: '#dc004e' }, // MUI default pink
  },
  ocean: {
    primary: { main: '#0077c2' }, // A deep blue
    secondary: { main: '#80deea' }, // A light cyan
  },
  forest: {
    primary: { main: '#2e7d32' }, // A rich green
    secondary: { main: '#ffc107' }, // A warm amber
  },
  forest: {
    primary: { main: '#b11a60ff' }, // A rich green
    secondary: { main: '#0a0a0aff' }, // A warm amber
  },
};

// Define your font families
export const fontOptions = {
  Roboto: 'Roboto, sans-serif',
  'Open Sans': "'Open Sans', sans-serif",
  Montserrat: "'Montserrat', sans-serif",
};

// A function to create a theme based on the user's choices
export const getTheme = (mode, palette, font) => createTheme({
  palette: {
    mode, // 'light' or 'dark'
    ...palettes[palette],
  },
  typography: {
    fontFamily: fontOptions[font],
    h4: {
      fontWeight: 700,
    },
  },
});