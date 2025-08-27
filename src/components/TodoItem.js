// src/components/TodoItem.js
import React from 'react';
import { ListItem, ListItemText, Checkbox, IconButton, Chip } from '@mui/material';
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
      secondaryAction={
        <>
          <IconButton edge="end" aria-label="edit" onClick={() => onEdit(todo)}>
            <EditIcon />
          </IconButton>
          <IconButton edge="end" aria-label="delete" onClick={() => onDelete(todo._id)}>
            <DeleteIcon />
          </IconButton>
        </>
      }
      disablePadding
    >
      <Checkbox
        edge="start"
        checked={todo.completed}
        onChange={() => onToggleComplete(todo)}
      />
      <ListItemText
        primary={todo.text}
        secondary={formattedDate}
        style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
      />
      {todo.priority && (
        <Chip 
          label={todo.priority} 
          color={priorityColors[todo.priority]} 
          size="small"
          style={{ marginRight: '40px' }}
        />
      )}
    </ListItem>
  );
}