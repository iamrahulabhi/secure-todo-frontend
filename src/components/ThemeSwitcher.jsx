// src/components/ThemeSwitcher.jsx
import React from 'react';
import { Box, Typography, IconButton, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useThemeContext } from '../ThemeContext';
import Brightness4Icon from '@mui/icons-material/Brightness4'; // Dark mode icon
import Brightness7Icon from '@mui/icons-material/Brightness7'; // Light mode icon

export default function ThemeSwitcher() {
  const { mode, toggleColorMode, changePalette, palette, changeFont, font } = useThemeContext();

  return (
    <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1, mt: 2 }}>
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