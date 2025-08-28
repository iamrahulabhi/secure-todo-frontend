import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box, Paper, Alert } from '@mui/material';
import api from '../api';
import LoadingButton from '../components/LoadingButton';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true); //start loader
    try {
      const response = await api.post('/login', { username, password });
      localStorage.setItem('token', response.data.token);
      navigate('/');
      window.location.reload(); // Force reload to update app state and protected routes
    } catch (err) {
      setError('Invalid username or password. Please try again.');
    }
    finally {
      setLoading(false); //stop loader
    }
    
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ marginTop: 8, padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">Sign In</Typography>
        <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
          <TextField margin="normal" required fullWidth label="Username" value={username} onChange={e => setUsername(e.target.value)} autoFocus />
          <TextField margin="normal" required fullWidth label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
          {error && <Alert severity="error" sx={{ width: '100%', mt: 2 }}>{error}</Alert>}
          <LoadingButton type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} loading={loading}>Sign In</LoadingButton>
          <Link to="/register" style={{ textDecoration: 'none' }}>{"Don't have an account? Sign Up"}</Link>
          <Link to="/forgot-password" style={{ textDecoration: 'none', display: 'block', marginTop: '10px' }}>  Forgot Password?</Link>
        </Box>
      </Paper>
    </Container>
  );
}