import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Box, Button, TextField, MenuItem, Typography, Alert } from '@mui/material';

const AddTrek = () => {
  const { token } = useContext(AuthContext);
  const [formData, setFormData] = useState({ name: '', location: '', difficulty: 'Easy', price: '', images: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const config = { headers: { 'x-auth-token': token } };
      const data = { ...formData, price: parseFloat(formData.price), images: formData.images.split(',').map(img => img.trim()) };
      await axios.post('/treks', data, config);
      toast.success('Trek added successfully!');
      navigate('/treks');
    } catch (err) {
      setError(err.response?.data?.msg || 'Error adding trek');
      toast.error('Error adding trek');
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4, p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom>Add New Trek</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <form onSubmit={handleSubmit}>
        <TextField label="Name" name="name" value={formData.name} onChange={handleChange} fullWidth required sx={{ mb: 2 }} />
        <TextField label="Location" name="location" value={formData.location} onChange={handleChange} fullWidth required sx={{ mb: 2 }} />
        <TextField select label="Difficulty" name="difficulty" value={formData.difficulty} onChange={handleChange} fullWidth sx={{ mb: 2 }}>
          <MenuItem value="Easy">Easy</MenuItem>
          <MenuItem value="Medium">Medium</MenuItem>
          <MenuItem value="Hard">Hard</MenuItem>
        </TextField>
        <TextField label="Price" name="price" type="number" value={formData.price} onChange={handleChange} fullWidth required sx={{ mb: 2 }} />
        <TextField label="Images (comma-separated URLs)" name="images" value={formData.images} onChange={handleChange} fullWidth multiline sx={{ mb: 2 }} />
        <Button type="submit" variant="contained" fullWidth>Add Trek</Button>
      </form>
    </Box>
  );
};

export default AddTrek;