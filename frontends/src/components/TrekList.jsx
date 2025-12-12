import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, TextField, MenuItem, Pagination, Typography, Skeleton, Alert, IconButton, Tooltip,
  Card, CardContent, Chip, Fade, Container, InputAdornment
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import HikingIcon from '@mui/icons-material/Hiking';

const TrekList = () => {
  const { token, logout } = useContext(AuthContext); 
  const [treks, setTreks] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState({ location: '', difficulty: '' });
  const [limit, setLimit] = useState(10);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); 
    toast.success('Logged out successfully');
    navigate('/login');
  };

  useEffect(() => {
    const fetchTreks = async () => {
      // Check if token exists in localStorage (for initial load) or context
      const currentToken = token || localStorage.getItem('token');
      
      if (!currentToken) {
        setLoading(false);
        setError('Please login to continue');
        navigate('/login');
        return;
      }

      setLoading(true);
      setError('');
      
      try {
        // Axis interceptor will automatically add the token, but we can also explicitly set it
        // The interceptor ensures token is always attached even on page refresh
        const res = await axios.get(`/treks?page=${page}&limit=${limit}`);
        setTreks(res.data.treks || []);
        // Use the total and limit from API response to ensure consistency
        const apiTotal = parseInt(res.data.total, 10) || 0;
        const apiLimit = parseInt(res.data.limit, 10) || limit;
        setTotal(apiTotal);
        setLimit(apiLimit);
      } catch (err) {
        // If unauthorized, redirect to login
        if (err.response?.status === 401) {
          logout();
          navigate('/login');
          toast.error('Session expired. Please login again');
        } else {
          setError(err.response?.data?.msg || 'Error fetching treks');
          toast.error('Error fetching treks');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchTreks();
  }, [page, token, limit, navigate, logout]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this trek?')) {
      try {
        // Axios interceptor will automatically add the token
        await axios.delete(`/treks/${id}`);
        const newTotal = total - 1;
        setTotal(newTotal);
        
        // If current page becomes empty after deletion, go to previous page
        const newPageCount = Math.ceil(newTotal / limit);
        if (newPageCount > 0 && page > newPageCount) {
          setPage(newPageCount);
        } else {
          // Refresh the current page to get updated data
          const res = await axios.get(`/treks?page=${page}&limit=${limit}`);
          setTreks(res.data.treks);
        }
        
        toast.success('Trek deleted successfully');
      } catch (err) {
        toast.error('Error deleting trek');
      }
    }
  };

  const handleSearchChange = (e) => {
    setSearch({ ...search, [e.target.name]: e.target.value });
  };

  const filteredTreks = treks.filter(trek =>
    (search.location ? trek.location.toLowerCase().includes(search.location.toLowerCase()) : true) &&
    (search.difficulty ? trek.difficulty === search.difficulty : true)
  );

  // Calculate page count: ensure total and limit are numbers
  const pageCount = total > 0 && limit > 0 ? Math.ceil(total / limit) : 0;

  if (loading) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        p: 3
      }}>
        <Container>
          <Skeleton variant="rectangular" width="100%" height={200} sx={{ borderRadius: 2, mb: 2 }} />
          <Skeleton variant="rectangular" width="100%" height={400} sx={{ borderRadius: 2 }} />
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}>
        <Alert 
          severity="error" 
          sx={{ 
            m: 3,
            borderRadius: 2,
            fontSize: '1.1rem',
            p: 2
          }}
        >
          {error}
        </Alert>
      </Box>
    );
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return { bg: '#e8f5e9', color: '#2e7d32', border: '#4caf50' };
      case 'Medium':
        return { bg: '#fff3e0', color: '#e65100', border: '#ff9800' };
      case 'Hard':
        return { bg: '#ffebee', color: '#c62828', border: '#f44336' };
      default:
        return { bg: '#f5f5f5', color: '#424242', border: '#9e9e9e' };
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      pb: 4
    }}>
      <Container maxWidth="xl">
        <Fade in={true} timeout={600}>
          <Box sx={{ pt: 4 }}>
            {/* Header Section */}
            <Card 
              elevation={8}
              sx={{ 
                mb: 4,
                borderRadius: 4,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        p: 1.5,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      }}
                    >
                      <HikingIcon sx={{ fontSize: 32, color: 'white' }} />
                    </Box>
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        fontWeight: 700,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      Trek Adventures
                    </Typography>
                  </Box>
                  <Tooltip title="Logout">
                    <IconButton 
                      onClick={handleLogout}
                      sx={{ 
                        bgcolor: 'error.main', 
                        color: 'white', 
                        '&:hover': { 
                          bgcolor: 'error.dark',
                          transform: 'scale(1.1)',
                        },
                        width: 56,
                        height: 56,
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 15px rgba(211, 47, 47, 0.4)',
                      }}
                    >
                      <LogoutIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </CardContent>
            </Card>

            {/* Action Bar */}
            <Card 
              elevation={8}
              sx={{ 
                mb: 4,
                borderRadius: 4,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                  <Button 
                    variant="contained"
                    startIcon={<AddCircleIcon />}
                    onClick={() => navigate('/add')}
                    sx={{
                      py: 1.5,
                      px: 3,
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
                    Add New Trek
                  </Button>
                </Box>

                {/* Search Filters */}
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <TextField 
                    label="Search Location" 
                    name="location" 
                    value={search.location} 
                    onChange={handleSearchChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ 
                      flex: 1,
                      minWidth: 200,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)',
                        },
                      },
                    }}
                  />
                  <TextField 
                    select 
                    label="Difficulty" 
                    name="difficulty" 
                    value={search.difficulty} 
                    onChange={handleSearchChange}
                    sx={{ 
                      minWidth: 150,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)',
                        },
                      },
                    }}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="Easy">Easy</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="Hard">Hard</MenuItem>
                  </TextField>
                </Box>
              </CardContent>
            </Card>

            {/* Trek Table */}
            <Card 
              elevation={8}
              sx={{ 
                borderRadius: 4,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                overflow: 'hidden',
              }}
            >
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ 
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    }}>
                      <TableCell sx={{ color: 'white', fontWeight: 700, fontSize: '1rem' }}>Name</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 700, fontSize: '1rem' }}>Location</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 700, fontSize: '1rem' }}>Difficulty</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 700, fontSize: '1rem' }}>Price</TableCell>
                      <TableCell align="center" sx={{ color: 'white', fontWeight: 700, fontSize: '1rem' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredTreks.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                          <Typography variant="h6" color="text.secondary">
                            No treks found. Add your first adventure!
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTreks.map((trek, index) => {
                        const diffColors = getDifficultyColor(trek.difficulty);
                        return (
                          <Fade in={true} timeout={300 + index * 100} key={trek._id}>
                            <TableRow 
                              hover
                              sx={{ 
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  transform: 'scale(1.01)',
                                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                },
                              }}
                            >
                              <TableCell>
                                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                  {trek.name}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <LocationOnIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                                  <Typography variant="body2">{trek.location}</Typography>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={trek.difficulty}
                                  sx={{
                                    bgcolor: diffColors.bg,
                                    color: diffColors.color,
                                    border: `2px solid ${diffColors.border}`,
                                    fontWeight: 700,
                                    fontSize: '0.875rem',
                                  }}
                                />
                              </TableCell>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <AttachMoneyIcon sx={{ fontSize: 18, color: 'success.main' }} />
                                  <Typography variant="body1" sx={{ fontWeight: 600, color: 'success.main' }}>
                                    {trek.price}
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                  <Button 
                                    size="small" 
                                    variant="contained"
                                    startIcon={<EditIcon />}
                                    onClick={() => navigate(`/edit/${trek._id}`)} 
                                    sx={{
                                      borderRadius: 2,
                                      textTransform: 'none',
                                      fontWeight: 600,
                                      transition: 'all 0.3s ease',
                                      '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 4px 12px rgba(25, 118, 210, 0.4)',
                                      },
                                    }}
                                  >
                                    Edit
                                  </Button>
                                  <Button 
                                    size="small" 
                                    variant="contained"
                                    color="error"
                                    startIcon={<DeleteIcon />}
                                    onClick={() => handleDelete(trek._id)}
                                    sx={{
                                      borderRadius: 2,
                                      textTransform: 'none',
                                      fontWeight: 600,
                                      transition: 'all 0.3s ease',
                                      '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 4px 12px rgba(211, 47, 47, 0.4)',
                                      },
                                    }}
                                  >
                                    Delete
                                  </Button>
                                </Box>
                              </TableCell>
                            </TableRow>
                          </Fade>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>

            {/* Pagination */}
            {pageCount > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Paper 
                  elevation={8}
                  sx={{ 
                    p: 2,
                    borderRadius: 4,
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <Pagination 
                    count={pageCount} 
                    page={page} 
                    onChange={(e, value) => setPage(value)} 
                    color="primary" 
                    size="large"
                    sx={{
                      '& .MuiPaginationItem-root': {
                        fontSize: '1rem',
                        fontWeight: 600,
                      },
                      '& .Mui-selected': {
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                        },
                      },
                    }}
                  />
                </Paper>
              </Box>
            )}
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default TrekList;