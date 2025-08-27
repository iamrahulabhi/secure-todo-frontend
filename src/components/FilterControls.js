// src/components/FilterControls.js
import React from 'react';
import { ButtonGroup, Button } from '@mui/material';

export default function FilterControls({ filter, setFilter }) {
  return (
    <ButtonGroup variant="outlined" aria-label="filter-buttons" fullWidth>
      <Button variant={filter === 'all' ? 'contained' : 'outlined'} onClick={() => setFilter('all')}>All</Button>
      <Button variant={filter === 'active' ? 'contained' : 'outlined'} onClick={() => setFilter('active')}>Active</Button>
      <Button variant={filter === 'completed' ? 'contained' : 'outlined'} onClick={() => setFilter('completed')}>Completed</Button>
    </ButtonGroup>
  );
}