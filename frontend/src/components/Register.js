import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { API_BASE } from '../constants';
import { TextField, Button, Paper, Typography, Box, Alert } from '@mui/material';
import { styled } from '@mui/material/styles';

const FormPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: 400,
  margin: 'auto',
  marginTop: theme.spacing(8),
}));

const Register = ({ onSwitchToLogin }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(`${API_BASE}/auth/register`, {
        username,
        email,
        password
      });
      register(response.data.user, response.data.token);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormPaper elevation={3}>
      <Typography variant="h4" align="center" gutterBottom>
        Register
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          label="Username"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <TextField
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 3 }}
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </Button>
        <Button onClick={onSwitchToLogin} fullWidth sx={{ mt: 2 }}>
          Already have an account? Login
        </Button>
      </Box>
    </FormPaper>
  );
};

export default Register;
