import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Grid,
  FormControl, FormLabel, ToggleButtonGroup, ToggleButton, Box, IconButton,
  List, ListItem, ListItemText, Checkbox, InputAdornment, Select, MenuItem, InputLabel,Typography 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

export default function TodoForm({ open, onClose, onSave, todo }) {
  // State for all fields
  const [text, setText] = useState('');
  const [description, setDescription] = useState('');
  const [tag, setTag] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const [time, setTime] = useState('');
  const [subtasks, setSubtasks] = useState([]);
  const [currentSubtask, setCurrentSubtask] = useState('');
  const [notes, setNotes] = useState('');

  // Populate form when editing a task
  useEffect(() => {
    if (todo) {
      setText(todo.text || '');
      setDescription(todo.description || '');
      setTag(todo.tag || '');
      setPriority(todo.priority || 'Medium');
      setDueDate(todo.dueDate ? todo.dueDate.split('T')[0] : '');
      setTime(todo.time || '');
      setSubtasks(todo.subtasks || []);
      setNotes(todo.notes || '');
    } else {
      // Reset form for new task
      setText('');
      setDescription('');
      setTag('');
      setPriority('Medium');
      setDueDate('');
      setTime('');
      setSubtasks([]);
      setCurrentSubtask('');
      setNotes('');
    }
  }, [todo, open]);

  const handleAddSubtask = () => {
    if (currentSubtask.trim()) {
      setSubtasks([...subtasks, { text: currentSubtask, completed: false }]);
      setCurrentSubtask('');
    }
  };
  
  const handleSubtaskToggle = (index) => {
    const newSubtasks = [...subtasks];
    newSubtasks[index].completed = !newSubtasks[index].completed;
    setSubtasks(newSubtasks);
  };

  const handleSave = () => {
     const taskData = {
      ...todo,
      text,
      description,
      tag,
      priority,
      dueDate,
      time,
      subtasks,
      notes,
    };

    // --- THIS IS THE FIX ---
    // If it's a new task (the 'todo' prop will be null), add the current date as startDate.
    // This ensures we don't overwrite the startDate every time we edit the task.
    if (!todo) {
      taskData.startDate = new Date().toISOString().split('T')[0]; // Format: "YYYY-MM-DD"
    }

    onSave(taskData); // Send the complete object to the backend
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{todo ? 'Edit Task' : 'New Task'}</DialogTitle>
      <DialogContent>
        {/* Main Task Title */}
        <FormControl fullWidth margin="normal">
          <FormLabel>Task Title</FormLabel>
          <TextField variant="filled" hiddenLabel value={text} onChange={(e) => setText(e.target.value)} />
        </FormControl>

        {/* Description */}
        <FormControl fullWidth margin="normal">
          <FormLabel>Description</FormLabel>
          <TextField variant="filled" hiddenLabel multiline rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
        </FormControl>
        
        <Grid container spacing={2}>
            {/* Tags */}
            <Grid item xs={12} md={6}>
                 <FormControl fullWidth margin="normal">
                    <FormLabel>Tags</FormLabel>
                    <Select variant="filled" hiddenLabel value={tag} onChange={(e) => setTag(e.target.value)} displayEmpty>
                        <MenuItem value=""><em>Done</em></MenuItem>
                        <MenuItem value="Work">Work</MenuItem>
                        <MenuItem value="Personal">Personal</MenuItem>
                        <MenuItem value="Urgent">Urgent</MenuItem>
                    </Select>
                 </FormControl>
            </Grid>
            {/* Priority */}
            <Grid item xs={12} md={6}>
                <FormControl component="fieldset" fullWidth margin="normal">
                    <FormLabel>Priority</FormLabel>
                    <ToggleButtonGroup value={priority} exclusive fullWidth onChange={(e, newPriority) => { if (newPriority) setPriority(newPriority); }}>
                        <ToggleButton value="Low" sx={{ flexGrow: 1 }}>Low</ToggleButton>
                        <ToggleButton value="Medium" sx={{ flexGrow: 1 }}>Medium</ToggleButton>
                        <ToggleButton value="High" sx={{ flexGrow: 1 }}>High</ToggleButton>
                    </ToggleButtonGroup>
                </FormControl>
            </Grid>
        </Grid>
        
        <Grid container spacing={2}>
            {/* Due Date */}
            <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                    <FormLabel>Due Date</FormLabel>
                    <TextField variant="filled" type="date" hiddenLabel value={dueDate} onChange={(e) => setDueDate(e.target.value)} InputLabelProps={{ shrink: true }} />
                </FormControl>
            </Grid>
            {/* Time */}
            <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                    <FormLabel>Time</FormLabel>
                    <TextField variant="filled" type="time" hiddenLabel value={time} onChange={(e) => setTime(e.target.value)} InputLabelProps={{ shrink: true }} />
                </FormControl>
            </Grid>
        </Grid>

        {/* Subtasks */}
        <FormControl fullWidth margin="normal">
          <FormLabel>Subtasks</FormLabel>
          <List dense>
            {subtasks.map((sub, index) => (
              <ListItem key={index} disablePadding>
                <Checkbox edge="start" checked={sub.completed} onChange={() => handleSubtaskToggle(index)} />
                <ListItemText primary={sub.text} />
              </ListItem>
            ))}
          </List>
          <Box display="flex">
            <TextField variant="filled" size="small" hiddenLabel fullWidth placeholder="Add subtask" value={currentSubtask} onChange={(e) => setCurrentSubtask(e.target.value)} />
            <IconButton onClick={handleAddSubtask}><AddIcon /></IconButton>
          </Box>
        </FormControl>

        {/* Attachments */}
        <FormControl fullWidth margin="normal">
            <FormLabel>Attachments</FormLabel>
            <Box sx={{ border: '2px dashed', borderColor: 'divider', borderRadius: 1, p: 3, textAlign: 'center', cursor: 'pointer' }}>
                <CloudUploadIcon sx={{ fontSize: 40, mb: 1 }} />
                <Typography>Drag and drop files here or click to browse</Typography>
                <Typography variant="caption">(File upload is a UI demo)</Typography>
            </Box>
        </FormControl>

        {/* Notes */}
        <FormControl fullWidth margin="normal">
            <FormLabel>Notes</FormLabel>
            <TextField variant="filled" hiddenLabel multiline rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
        </FormControl>

      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">Save Task</Button>
      </DialogActions>
    </Dialog>
  );
}