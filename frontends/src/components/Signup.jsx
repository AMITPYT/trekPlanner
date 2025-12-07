import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Box, Button, TextField, Typography, Alert, Link } from '@mui/material';

const Signup = () => {
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('/auth/signup', formData);
      login(res.data.token);
      toast.success('Signed up successfully!');
      navigate('/treks');
    } catch (err) {
      setError(err.response?.data?.msg || 'Error signing up');
      toast.error('Signup failed');
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8, p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom>Sign Up</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <form onSubmit={handleSubmit}>
        <TextField label="Name" name="name" value={formData.name} onChange={handleChange} fullWidth required sx={{ mb: 2 }} />
        <TextField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} fullWidth required sx={{ mb: 2 }} />
        <TextField label="Password" name="password" type="password" value={formData.password} onChange={handleChange} fullWidth required sx={{ mb: 2 }} />
        <Button type="submit" variant="contained" fullWidth sx={{ mb: 1 }}>Sign Up</Button>
      </form>
      <Typography variant="body2" align="center">
        Already have an account? <Link href="/login">Login</Link>
      </Typography>
    </Box>
  );
};

export default Signup;