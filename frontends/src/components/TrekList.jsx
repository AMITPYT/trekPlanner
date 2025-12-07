import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, TextField, MenuItem, Pagination, Typography, Skeleton, Alert, IconButton, Tooltip
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

const TrekList = () => {
  const { token, logout } = useContext(AuthContext); 
  const [treks, setTreks] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState({ location: '', difficulty: '' });
  const navigate = useNavigate();
  const limit = 10;

  const handleLogout = () => {
    logout(); 
    toast.success('Logged out successfully');
    navigate('/login');
  };

  useEffect(() => {
    const fetchTreks = async () => {
      setLoading(true);
      setError('');
      try {
        const config = { headers: { 'x-auth-token': token } };
        const res = await axios.get(`/treks?page=${page}`, config);
        setTreks(res.data.treks);
        setTotal(res.data.total);
      } catch (err) {
        setError(err.response?.data?.msg || 'Error fetching treks');
        toast.error('Error fetching treks');
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchTreks();
  }, [page, token]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this trek?')) {
      try {
        const config = { headers: { 'x-auth-token': token } };
        await axios.delete(`/treks/${id}`, config);
        setTreks(treks.filter(trek => trek._id !== id));
        setTotal(total - 1);
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

  const pageCount = Math.ceil(total / limit);

  if (loading) return <Box sx={{ p: 3 }}>...</Box>;

  if (error) return <Alert severity="error" sx={{ m: 3 }}>{error}</Alert>;

  return (
    <Box sx={{ p: 3, position: 'relative', minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Trek List</Typography>
        <Tooltip title="Logout">
          <IconButton 
            color="error" 
            onClick={handleLogout}
            sx={{ 
              bgcolor: 'error.main', 
              color: 'white', 
              '&:hover': { bgcolor: 'error.dark' },
              width: 50,
              height: 50
            }}
          >
            <LogoutIcon />
          </IconButton>
        </Tooltip>
      </Box>
      <Button 
        variant="contained" 
        onClick={() => navigate('/add')} 
        sx={{ mb: 3 }}
      >
        Add New Trek
      </Button>
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField 
          label="Search Location" 
          name="location" 
          value={search.location} 
          onChange={handleSearchChange} 
          size="small"
        />
        <TextField 
          select 
          label="Difficulty" 
          name="difficulty" 
          value={search.difficulty} 
          onChange={handleSearchChange}
          size="small"
          sx={{ minWidth: 120 }}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="Easy">Easy</MenuItem>
          <MenuItem value="Medium">Medium</MenuItem>
          <MenuItem value="Hard">Hard</MenuItem>
        </TextField>
      </Box>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Location</strong></TableCell>
              <TableCell><strong>Difficulty</strong></TableCell>
              <TableCell><strong>Price</strong></TableCell>
              <TableCell align="center"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTreks.map((trek) => (
              <TableRow key={trek._id} hover>
                <TableCell>{trek.name}</TableCell>
                <TableCell>{trek.location}</TableCell>
                <TableCell>
                  <Box sx={{ 
                    color: trek.difficulty === 'Easy' ? 'success.main' : trek.difficulty === 'Medium' ? 'warning.main' : 'error.main',
                    fontWeight: 'bold'
                  }}>
                    {trek.difficulty}
                  </Box>
                </TableCell>
                <TableCell>${trek.price}</TableCell>
                <TableCell>
                  <Button 
                    size="small" 
                    onClick={() => navigate(`/edit/${trek._id}`)} 
                    color="primary"
                  >
                    Edit
                  </Button>
                  <Button 
                    size="small" 
                    onClick={() => handleDelete(trek._id)} 
                    color="error"
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Pagination 
          count={pageCount} 
          page={page} 
          onChange={(e, value) => setPage(value)} 
          color="primary" 
          size="large"
        />
      </Box>
    </Box>
  );
};

export default TrekList;