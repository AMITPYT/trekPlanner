import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Box, Button, TextField, MenuItem, Typography, Alert, Skeleton } from '@mui/material';

const EditTrek = () => {
  const { token } = useContext(AuthContext);
  const [formData, setFormData] = useState({ name: '', location: '', difficulty: '', price: '', images: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrek = async () => {
      try {
        const config = { headers: { 'x-auth-token': token } };
        const res = await axios.get(`/treks/${id}`, config);
        setFormData({
          name: res.data.name,
          location: res.data.location,
          difficulty: res.data.difficulty,
          price: res.data.price.toString(),
          images: res.data.images.join(', '),
        });
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.msg || 'Error fetching trek');
        toast.error('Error fetching trek');
        setLoading(false);
      }
    };
    fetchTrek();
  }, [id, token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const config = { headers: { 'x-auth-token': token } };
      const data = { ...formData, price: parseFloat(formData.price), images: formData.images.split(',').map(img => img.trim()) };
      await axios.put(`/treks/${id}`, data, config);
      toast.success('Trek updated successfully!');
      navigate('/treks');
    } catch (err) {
      setError(err.response?.data?.msg || 'Error updating trek');
      toast.error('Error updating trek');
    }
  };

  if (loading) {
    return (
      <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
        <Skeleton variant="text" height={40} />
        <Skeleton variant="rectangular" height={56} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={56} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={56} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={56} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={56} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={40} />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4, p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom>Edit Trek</Typography>
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
        <Button type="submit" variant="contained" fullWidth>Update Trek</Button>
      </form>
    </Box>
  );
};

export default EditTrek;