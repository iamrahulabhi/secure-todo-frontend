// src/components/TodoItem.jsx

import React from 'react';
import { ListItem, ListItemText, Checkbox, IconButton, Chip, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { format } from 'date-fns'; // Library to format dates nicely

const priorityColors = {
  High: 'error',
  Medium: 'warning',
  Low: 'success',
};

export default function TodoItem({ todo, onToggleComplete, onDelete, onEdit }) {
  // --- THIS IS THE KEY LOGIC ---
  // It checks if a dueDate exists, then formats it into a readable string like "Aug 29, 2025".
  const formattedDate = todo.dueDate ? format(new Date(todo.dueDate), 'MMM dd, yyyy') : '';

  return (
    <ListItem
      sx={{ pr: '120px' }} // Keeps the padding to prevent overlap
      disablePadding
    >
      <Checkbox
        edge="start"
        checked={todo.completed}
        onChange={() => onToggleComplete(todo)}
      />
      
      <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
        <ListItemText
          primary={todo.text}
          // --- THE FORMATTED DATE IS DISPLAYED HERE ---
          secondary={formattedDate} 
          sx={{ 
            textDecoration: todo.completed ? 'line-through' : 'none',
            flexShrink: 1,
            mr: 1
          }}
        />
        {todo.priority && (
          <Chip 
            label={todo.priority} 
            color={priorityColors[todo.priority]} 
            size="small"
            sx={{ flexShrink: 0 }}
          />
        )}
      </Box>

      <Box sx={{ position: 'absolute', right: 0 }}> 
          <IconButton edge="end" aria-label="edit" onClick={() => onEdit(todo)}>
            <EditIcon />
          </IconButton>
          <IconButton edge="end" aria-label="delete" onClick={() => onDelete(todo._id)}>
            <DeleteIcon />
          </IconButton>
      </Box>
    </ListItem>
  );
}