import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Box, Paper, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';
import api from '../api';
import TodoList from '../components/TodoList';
import TodoForm from '../components/TodoForm';
import FilterControls from '../components/FilterControls';

export default function HomePage() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

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

  return (
    <>
      <Container maxWidth="md" style={{ marginTop: '2rem' }}>
        <Paper elevation={3} style={{ padding: '2rem' }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h4" component="h1">My Tasks ✅</Typography>
            <Box>
              <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenForm()} sx={{ mr: 2 }}>Add Task</Button>
              <Button variant="outlined" startIcon={<LogoutIcon />} onClick={handleLogout}>Logout</Button>
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
      <TodoForm open={isFormOpen} onClose={handleCloseForm} onSave={handleSaveTodo} todo={editingTodo} />
    </>
  );
}