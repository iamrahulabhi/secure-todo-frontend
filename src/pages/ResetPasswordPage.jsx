import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box, Paper, Alert } from '@mui/material';
import api from '../api';

export default function ResetPasswordPage() {
  const [otp, setOtp] = useState('');
  const [isOtpVerified, setIsOtpVerified] = useState(false); // --- NEW: State to manage UI flow ---
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  // --- NEW: Function to handle OTP verification ---
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/verify-otp', { token, otp });
      setIsOtpVerified(true); // On success, show the password fields
      setMessage('OTP verified. You can now set a new password.');
    } catch (err) {
      setError(err.response?.data?.message || 'OTP verification failed.');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setError('');
    setMessage('');
    try {
      const response = await api.post('/reset-password', { token, password });
      setMessage(response.data.message + ' Redirecting to login...');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password.');
    }
  };

  if (!token) {
    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={3} sx={{ marginTop: 8, padding: 4, textAlign: 'center' }}>
                <Alert severity="error">No reset token found. Please request a new link.</Alert>
            </Paper>
        </Container>
    );
  }

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ marginTop: 8, padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {!isOtpVerified ? (
          // --- STAGE 1: OTP VERIFICATION FORM ---
          <>
            <Typography component="h1" variant="h5">Verify Your Identity</Typography>
            <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>An OTP has been sent to your email. Please enter it below.</Typography>
            <Box component="form" onSubmit={handleVerifyOtp} sx={{ mt: 1 }}>
              <TextField margin="normal" required fullWidth label="One-Time Password (OTP)" value={otp} onChange={e => setOtp(e.target.value)} autoFocus />
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Verify OTP</Button>
            </Box>
          </>
        ) : (
          // --- STAGE 2: RESET PASSWORD FORM ---
          <>
            <Typography component="h1" variant="h5">Set New Password</Typography>
            <Box component="form" onSubmit={handleResetPassword} sx={{ mt: 1 }}>
              <TextField margin="normal" required fullWidth label="New Password" type="password" value={password} onChange={e => setPassword(e.target.value)} autoFocus />
              <TextField margin="normal" required fullWidth label="Confirm New Password" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Reset Password</Button>
            </Box>
          </>
        )}
        {message && <Alert severity="success" sx={{ width: '100%', mt: 2 }}>{message}</Alert>}
        {error && <Alert severity="error" sx={{ width: '100%', mt: 2 }}>{error}</Alert>}
      </Paper>
    </Container>
  );
}