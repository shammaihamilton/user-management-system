import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { login } from '../redux/slices/authSlice';
import { RootState, AppDispatch } from '../redux/store';
import { Box, Button, TextField, Typography, CircularProgress, Alert } from '@mui/material';

const Login: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    dispatch(login({ username, password }));
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        margin: 'auto',
        mt: 8,
        p: 4,
        borderRadius: 2,
        boxShadow: 3,
        bgcolor: 'background.paper',
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Login
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          value={username}
          onChange={(e) => setUserName(e.target.value)}
          required
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
          sx={{ height: 48, fontSize: '1rem' }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
        </Button>
      </Box>
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default Login;
