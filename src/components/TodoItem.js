import React from 'react';
import { ListItem, ListItemText, Checkbox, IconButton, Chip, Box, Typography, LinearProgress } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { format } from 'date-fns';

const priorityColors = { High: 'error', Medium: 'warning', Low: 'success' };

export default function TodoItem({ todo, onToggleComplete, onDelete, onEdit }) {
  // Format due date and time
  const formattedDate = todo.dueDate ? format(new Date(todo.dueDate), 'MMM dd, yyyy') : '';
  const formattedTime = todo.time ? new Date(`1970-01-01T${todo.time}`).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : '';
  
  // Calculate subtask progress
  const completedSubtasks = todo.subtasks?.filter(s => s.completed).length || 0;
  const totalSubtasks = todo.subtasks?.length || 0;
  const subtaskProgress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

  return (
    <Box sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
      <ListItem alignItems="flex-start" sx={{ pr: '96px' }} disablePadding>
        <Checkbox
          edge="start"
          checked={todo.completed}
          onChange={() => onToggleComplete(todo)}
          sx={{ pt: 1.5 }}
        />
        <ListItemText
          primary={
            <Typography sx={{ textDecoration: todo.completed ? 'line-through' : 'none', fontWeight: 500 }}>
              {todo.text}
            </Typography>
          }
          secondary={`${formattedDate}${formattedTime ? ` at ${formattedTime}` : ''}`}
        />
        {todo.tag && <Chip label={todo.tag} size="small" sx={{ mr: 1, mt: 1.5 }} />}
        <Chip label={todo.priority} color={priorityColors[todo.priority]} size="small" sx={{ mr: 1, mt: 1.5 }} />

        <Box sx={{ position: 'absolute', right: 8, top: 8 }}>
          <IconButton onClick={() => onEdit(todo)}><EditIcon /></IconButton>
          <IconButton onClick={() => onDelete(todo._id)}><DeleteIcon /></IconButton>
        </Box>
      </ListItem>
      
      {/* Subtask Progress Bar */}
      {totalSubtasks > 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center', pl: 7, pr: 2, pb: 1 }}>
              <LinearProgress variant="determinate" value={subtaskProgress} sx={{ width: '100%', mr: 2, height: 8, borderRadius: 4 }} />
              <Typography variant="caption" color="text.secondary">{`${completedSubtasks}/${totalSubtasks}`}</Typography>
          </Box>
      )}
    </Box>
  );
}