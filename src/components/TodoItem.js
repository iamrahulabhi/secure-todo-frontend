// src/components/TodoItem.js
import React from 'react';
import { ListItem, ListItemText, Checkbox, IconButton, Chip,Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { format } from 'date-fns';

const priorityColors = {
  High: 'error',
  Medium: 'warning',
  Low: 'success',
};

export default function TodoItem({ todo, onToggleComplete, onDelete, onEdit }) {
  const formattedDate = todo.dueDate ? format(new Date(todo.dueDate), 'MMM dd, yyyy') : '';

  return (
     <ListItem
      sx={{ pr: '120px' }}
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
          secondary={formattedDate}
          sx={{ 
            textDecoration: todo.completed ? 'line-through' : 'none',
            minWidth: '100px', // Give it a minimum width if needed
            flexShrink: 1, // Allow text to shrink
            mr: 1 
          }}
        />
        {todo.priority && (
          <Chip 
            label={todo.priority} 
            color={priorityColors[todo.priority]} 
            size="small"
            sx={{ flexShrink: 0 }} // Prevent chip from shrinking
          />
        )}
      </Box>

      {/* Secondary action for icons, position it absolutely */}
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