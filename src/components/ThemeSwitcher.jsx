import React from 'react';
import { Box, Typography, IconButton, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useThemeContext } from '../ThemeContext';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

export default function ThemeSwitcher() {
  // --- MODIFIED: Get new state and function from context ---
  const { mode, toggleColorMode, changePalette, palette, changeFont, font, changeBackground, background, changePaperBackground, paperBackground } = useThemeContext();

  return (
    <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1, mt: 2, minWidth: 240 }}>
      <Typography variant="h6" gutterBottom>Theme Settings</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography>Mode</Typography>
        <IconButton onClick={toggleColorMode} color="inherit">
          {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Box>
      <FormControl fullWidth margin="normal">
        <InputLabel>Color Palette</InputLabel>
        <Select value={palette} label="Color Palette" onChange={(e) => changePalette(e.target.value)}>
          <MenuItem value="default">Default Blue</MenuItem>
          <MenuItem value="ocean">Ocean Blue</MenuItem>
          <MenuItem value="forest">Forest Green</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth margin="normal">
        <InputLabel>Body Background</InputLabel>
        <Select value={background} label="Body Background" onChange={(e) => changeBackground(e.target.value)}>
          <MenuItem value="default">Default</MenuItem>
          <MenuItem value="stone">Stone</MenuItem>
          <MenuItem value="linen">Linen</MenuItem>
        </Select>
      </FormControl>
      {/* --- NEW: Paper Background Dropdown --- */}
      <FormControl fullWidth margin="normal">
        <InputLabel>Card Background</InputLabel>
        <Select value={paperBackground} label="Card Background" onChange={(e) => changePaperBackground(e.target.value)}>
          <MenuItem value="default">Translucent</MenuItem>
          <MenuItem value="solid">Solid</MenuItem>
          <MenuItem value="translucent">More Translucent</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth margin="normal">
        <InputLabel>Font</InputLabel>
        <Select value={font} label="Font" onChange={(e) => changeFont(e.target.value)}>
          <MenuItem value="Roboto">Roboto</MenuItem>
          <MenuItem value="Open Sans">Open Sans</MenuItem>
          <MenuItem value="Montserrat">Montserrat</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}