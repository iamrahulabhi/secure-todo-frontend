// src/pages/RegisterPage.jsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box, Paper, Alert } from '@mui/material';
import api from '../api';
import LoadingButton from '../components/LoadingButton';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState(''); // --- NEW: State for email ---
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true); //start loader 
    
    if (password.length < 6) {
        setError("Password must be at least 6 characters long.");
        return;
    }

    try {
      // --- NEW: Send email along with username and password ---
      await api.post('/register', { username, email, password });
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
    finally {
      setLoading(false); //stop loader
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ marginTop: 8, padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">Sign Up</Typography>
        <Box component="form" onSubmit={handleRegister} sx={{ mt: 1 }}>
          <TextField 
            margin="normal" 
            required 
            fullWidth 
            label="Username" 
            value={username} 
            onChange={e => setUsername(e.target.value)} 
            autoFocus 
          />
          {/* --- NEW: Email input field --- */}
          <TextField 
            margin="normal" 
            required 
            fullWidth 
            label="Email Address"
            type="email"
            value={email} 
            onChange={e => setEmail(e.target.value)} 
          />
          <TextField 
            margin="normal" 
            required 
            fullWidth 
            label="Password" 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
          />
          {error && <Alert severity="error" sx={{ width: '100%', mt: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ width: '100%', mt: 2 }}>{success}</Alert>}
          <LoadingButton type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} loading={loading}>Sign Up</LoadingButton>
          <Link to="/login" style={{ textDecoration: 'none' }}>{"Already have an account? Sign In"}</Link>
        </Box>
      </Paper>
    </Container>
  );
}