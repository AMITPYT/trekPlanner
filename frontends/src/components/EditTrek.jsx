import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  Box, Button, TextField, MenuItem, Typography, Alert, Skeleton, Paper, 
  Container, InputAdornment, Fade
} from '@mui/material';
import TitleIcon from '@mui/icons-material/Title';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import TerrainIcon from '@mui/icons-material/Terrain';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ImageIcon from '@mui/icons-material/Image';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';

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
        // Axios interceptor will automatically add the token
        const res = await axios.get(`/treks/${id}`);
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
      // Axios interceptor will automatically add the token
      const data = { ...formData, price: parseFloat(formData.price), images: formData.images.split(',').map(img => img.trim()) };
      await axios.put(`/treks/${id}`, data);
      toast.success('Trek updated successfully!');
      navigate('/treks');
    } catch (err) {
      setError(err.response?.data?.msg || 'Error updating trek');
      toast.error('Error updating trek');
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <Container maxWidth="sm">
          <Paper sx={{ p: 4, borderRadius: 4 }}>
            <Skeleton variant="text" height={40} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" height={56} sx={{ mb: 2, borderRadius: 2 }} />
            <Skeleton variant="rectangular" height={56} sx={{ mb: 2, borderRadius: 2 }} />
            <Skeleton variant="rectangular" height={56} sx={{ mb: 2, borderRadius: 2 }} />
            <Skeleton variant="rectangular" height={56} sx={{ mb: 2, borderRadius: 2 }} />
            <Skeleton variant="rectangular" height={120} sx={{ mb: 2, borderRadius: 2 }} />
            <Skeleton variant="rectangular" height={48} sx={{ borderRadius: 2 }} />
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Fade in={true} timeout={800}>
          <Paper
            elevation={24}
            sx={{
              p: 4,
              borderRadius: 4,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  p: 2,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  mb: 2,
                }}
              >
                <EditIcon sx={{ fontSize: 40, color: 'white' }} />
              </Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1,
                }}
              >
                Edit Trek
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Update your adventure details
              </Typography>
            </Box>

            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3,
                  borderRadius: 2,
                  '& .MuiAlert-icon': { alignItems: 'center' }
                }}
              >
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
              <TextField
                label="Trek Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                required
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                    },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <TitleIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                fullWidth
                required
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                    },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOnIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                select
                label="Difficulty"
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                fullWidth
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                    },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <TerrainIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              >
                <MenuItem value="Easy">Easy</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Hard">Hard</MenuItem>
              </TextField>
              <TextField
                label="Price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                fullWidth
                required
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                    },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AttachMoneyIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Images (comma-separated URLs)"
                name="images"
                value={formData.images}
                onChange={handleChange}
                fullWidth
                multiline
                rows={3}
                sx={{
                  mb: 4,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                    },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                      <ImageIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<ArrowBackIcon />}
                  onClick={() => navigate('/treks')}
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 600,
                    fontSize: '1rem',
                    textTransform: 'none',
                    borderWidth: 2,
                    '&:hover': {
                      borderWidth: 2,
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  startIcon={<SaveIcon />}
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    fontWeight: 600,
                    fontSize: '1rem',
                    textTransform: 'none',
                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                    },
                  }}
                >
                  Update Trek
                </Button>
              </Box>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default EditTrek;