import { createTheme } from '@mui/material/styles';

const palettes = {
  default: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
  },
  ocean: {
    primary: { main: '#0077c2' },
    secondary: { main: '#80deea' },
  },
  forest: {
    primary: { main: '#2e7d32' },
    secondary: { main: '#ffc107' },
  },
};

const backgrounds = {
  default: {
    light: '#ffffff',
    dark: '#121212',
  },
  stone: {
    light: '#f5f5f5',
    dark: '#303030',
  },
  linen: {
    light: '#faf3e0',
    dark: '#2c2a2b',
  },
};

// --- NEW: Define Paper background color options ---
const paperBackgrounds = {
  default: {
    light: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white
    dark: 'rgba(66, 66, 66, 0.8)',    // Semi-transparent dark grey
  },
  solid: {
    light: '#ffffff',                 // Solid white
    dark: '#424242',                  // Solid dark grey
  },
  translucent: {
    light: 'rgba(255, 255, 255, 0.6)', // More translucent white
    dark: 'rgba(66, 66, 66, 0.6)',    // More translucent dark grey
  },
};

export const fontOptions = {
  Roboto: 'Roboto, sans-serif',
  'Open Sans': "'Open Sans', sans-serif",
  Montserrat: "'Montserrat', sans-serif",
};

// --- MODIFIED: getTheme now accepts a paperBackground choice ---
export const getTheme = (mode, palette, font, background, paperBackground) => createTheme({
  palette: {
    mode,
    ...palettes[palette],
    background: {
      default: backgrounds[background][mode],
      paper: paperBackgrounds[paperBackground][mode],
    },
  },
  typography: {
    fontFamily: fontOptions[font],
    h4: {
      fontWeight: 700,
    },
  },
  // --- UPDATED with your specific CSS for the glass effect ---
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          // Note: We use the dynamic background from your theme settings.
          // The other styles are from your provided CSS.
          backgroundColor: paperBackgrounds[paperBackground][mode],
          borderRadius: '16px',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(5px)',
          WebkitBackdropFilter: 'blur(5px)', // For Safari support
          border: '1px solid rgba(255, 255, 255, 0.3)',
        }
      }
    }
  }
});