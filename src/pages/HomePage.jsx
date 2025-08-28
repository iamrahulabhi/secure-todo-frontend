import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Box, Paper, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';
import api from '../api';
import TodoList from '../components/TodoList';
import TodoForm from '../components/TodoForm';
import FilterControls from '../components/FilterControls';
import ThemeSwitcher from '../components/ThemeSwitcher';
import SettingsIcon from '@mui/icons-material/Settings'; // <-- NEW: Import Settings icon
import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material'; // <-- NEW: Import Dialog components
import VoiceCommandButton from '../components/VoiceCommandButton';


export default function HomePage() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleSettingsOpen = () => {
    setSettingsOpen(true);
  };

  const handleSettingsClose = () => {
    setSettingsOpen(false);
  };

  useEffect(() => {
    api.get('/todos')
      .then(response => {
        setTodos(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching todos:", error);
        setLoading(false);
      });
  }, []);

  const handleOpenForm = (todo = null) => {
    setEditingTodo(todo);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTodo(null);
  };

  const handleSaveTodo = (todoData) => {
    const promise = todoData._id
      ? api.put(`/todos/${todoData._id}`, todoData)
      : api.post('/todos', todoData);

    promise.then(response => {
      setTodos(prevTodos => todoData._id
        ? prevTodos.map(t => t._id === todoData._id ? response.data : t)
        : [...prevTodos, response.data]
      );
    }).catch(error => console.error("Error saving todo:", error));
  };

  const handleDeleteTodo = (id) => {
    api.delete(`/todos/${id}`)
      .then(() => setTodos(prevTodos => prevTodos.filter(t => t._id !== id)))
      .catch(error => console.error("Error deleting todo:", error));
  };

  const handleToggleComplete = (todo) => {
    const updatedTodo = { ...todo, completed: !todo.completed };
    api.put(`/todos/${todo._id}`, updatedTodo)
      .then(response => setTodos(prevTodos => prevTodos.map(t => t._id === todo._id ? response.data : t)))
      .catch(error => console.error("Error updating todo:", error));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    window.location.reload();
  };

  const filteredTodos = useMemo(() => {
    const sortedTodos = [...todos].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    switch (filter) {
      case 'active': return sortedTodos.filter(t => !t.completed);
      case 'completed': return sortedTodos.filter(t => t.completed);
      default: return sortedTodos;
    }
  }, [todos, filter]);

  // --- NEW: Function to handle the result from the voice command ---
  const handleVoiceResult = (transcript) => {
  if (!transcript) return;
  
  console.log("Voice transcript received:", transcript);
  
  // Directly create a new task with the transcribed text.
  // No AI, no parsing, no due dates or priorities from voice.
  handleSaveTodo({ text: transcript });
};


  return (
    <>
      <Container maxWidth="md" style={{ marginTop: '2rem' }}>
        <Paper elevation={3} style={{ padding: '2rem', transition: 'background-color 0.3s' }}>
          
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h4" component="h1">My Tasks ✅</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {/* --- ADD THE VOICE BUTTON HERE --- */}
              <VoiceCommandButton onResult={handleVoiceResult} />
              <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenForm()} sx={{ mr: 1 }}>Add Task</Button>
              <Button variant="outlined" startIcon={<LogoutIcon />} onClick={handleLogout} sx={{ mr: 1 }}>Logout</Button>
              
              {/* --- NEW: Settings Icon Button --- */}
              <IconButton onClick={handleSettingsOpen} color="inherit">
                <SettingsIcon />
              </IconButton>
            </Box>
          </Box>
          
          <Box mb={2}><FilterControls filter={filter} setFilter={setFilter} /></Box>
          
          {loading ? (
            <Box display="flex" justifyContent="center" my={4}><CircularProgress /></Box>
          ) : (
            <TodoList todos={filteredTodos} onToggleComplete={handleToggleComplete} onDelete={handleDeleteTodo} onEdit={handleOpenForm} />
          )}
        </Paper>
      </Container>
      
      {/* Your existing TodoForm Dialog */}
      <TodoForm open={isFormOpen} onClose={handleCloseForm} onSave={handleSaveTodo} todo={editingTodo} />

      {/* --- NEW: Settings Dialog Modal --- */}
      <Dialog open={settingsOpen} onClose={handleSettingsClose}>
        <DialogTitle>Theme Settings</DialogTitle>
        <DialogContent>
          {/* The ThemeSwitcher component is now inside the modal */}
          <ThemeSwitcher />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSettingsClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}