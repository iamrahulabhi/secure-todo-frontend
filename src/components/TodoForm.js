// src/components/TodoForm.js
import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, Button, Select, MenuItem, FormControl, InputLabel, DialogActions } from '@mui/material';

export default function TodoForm({ open, onClose, onSave, todo }) {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (todo) {
      setText(todo.text);
      setPriority(todo.priority || 'Medium');
      setDueDate(todo.dueDate ? todo.dueDate.split('T')[0] : '');
    } else {
      setText('');
      setPriority('Medium');
      setDueDate('');
    }
  }, [todo, open]);

  const handleSave = () => {
    onSave({ ...todo, text, priority, dueDate });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{todo ? 'Edit Task' : 'Add New Task'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Task Description"
          type="text"
          fullWidth
          variant="outlined"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <FormControl fullWidth margin="dense">
          <InputLabel>Priority</InputLabel>
          <Select
            value={priority}
            label="Priority"
            onChange={(e) => setPriority(e.target.value)}
          >
            <MenuItem value="High">High</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="Low">Low</MenuItem>
          </Select>
        </FormControl>
        <TextField
          margin="dense"
          label="Due Date"
          type="date"
          fullWidth
          InputLabelProps={{ shrink: true }}
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  );
}