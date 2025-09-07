import React from 'react';
import { ListItem, ListItemText, Checkbox, IconButton, Chip, Box, Typography, LinearProgress } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { format } from 'date-fns';

const priorityColors = { High: 'error', Medium: 'warning', Low: 'success' };

export default function TodoItem({ todo, onToggleComplete, onDelete, onEdit }) {
  // Format due date and time
  const formattedStartDate = todo.startDate ? format(new Date(todo.startDate), 'MMM dd, yyyy') : '';
  const formattedDueDate = todo.dueDate ? format(new Date(todo.dueDate), 'MMM dd, yyyy') : '';
  const formattedTime = todo.time ? new Date(`1970-01-01T${todo.time}`).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : '';
  
  // Calculate subtask progress
  const completedSubtasks = todo.subtasks?.filter(s => s.completed).length || 0;
  const totalSubtasks = todo.subtasks?.length || 0;
  const subtaskProgress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

  return (
    <Box sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
      {/* --- THIS IS THE FIX --- */}
      <ListItem 
        alignItems="center" 
        sx={{ 
          position: 'relative', // Establishes a positioning context for the icons
          pr: '96px',           // Adds padding on the right to reserve space for icons
          pl: 2, 
          py: 1.5 
        }}
      >
        <Checkbox
          edge="start"
          checked={todo.completed}
          onChange={() => onToggleComplete(todo)}
          sx={{ pr: 2 }}
        />

        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <ListItemText
              sx={{ wordBreak: 'break-word' }}
              primary={
                <Typography sx={{ textDecoration: todo.completed ? 'line-through' : 'none', fontWeight: 500 }}>
                  {todo.text}
                </Typography>
              }
              // After
              secondary={
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mt: 0.5 }}>
      {formattedStartDate && (
        <Typography component="span" variant="caption" color="text.secondary">
          Start: {formattedStartDate}
        </Typography>
      )}
      {/* Add a separator only if both dates exist */}
      {formattedStartDate && formattedDueDate && (
        <Typography component="span" variant="caption" color="text.secondary">
          
        </Typography>
      )}
      {formattedDueDate && (
        <Typography component="span" variant="caption" color="text.secondary">
          Due: {formattedDueDate}
        </Typography>
      )}
    </Box>
  }/*${formattedTime ? ` at ${formattedTime}` : ''} removded from views*/ 
            />
            <Box sx={{ display: 'flex', gap: 1, flexShrink: 0, pl: 1 }}>
              {todo.tag && <Chip label={todo.tag} size="small" />}
              <Chip label={todo.priority} color={priorityColors[todo.priority]} size="small" />
            </Box>
          </Box>
          
          {totalSubtasks > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <LinearProgress variant="determinate" value={subtaskProgress} sx={{ width: '100%', mr: 2, height: 8, borderRadius: 4 }} />
              <Typography variant="caption" color="text.secondary">{`${completedSubtasks}/${totalSubtasks}`}</Typography>
            </Box>
          )}
        </Box>

        <Box sx={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)' }}>
          <IconButton onClick={() => onEdit(todo)}><EditIcon /></IconButton>
          <IconButton onClick={() => onDelete(todo._id)}><DeleteIcon /></IconButton>
        </Box>
      </ListItem>
    </Box>
  );
}