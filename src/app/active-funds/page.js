'use client';

import { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Pagination from '@mui/material/Pagination';
import Button from '@mui/material/Button';
import Link from 'next/link';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import SearchIcon from '@mui/icons-material/Search';
import { useRouter } from 'next/navigation';

export default function ActiveFunds() {
  const router = useRouter();
  const [schemes, setSchemes] = useState([]);
  const [filteredSchemes, setFilteredSchemes] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState('name_asc');
  const schemesPerPage = 24;

  useEffect(() => {
    setLoading(true);
    fetch('/api/mf/active')
      .then(res => res.json())
      .then(data => {
        console.log('Active funds API response:', data);
        const activeSchemes = Array.isArray(data) ? data : (data?.data || []);
        console.log(`Active schemes loaded: ${activeSchemes.length}`);
        setSchemes(activeSchemes);
        setFilteredSchemes(activeSchemes);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching schemes:', err);
        setSchemes([]);
        setFilteredSchemes([]);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let processed = [...schemes];
    if (search) processed = processed.filter(s => s.schemeName.toLowerCase().includes(search.toLowerCase()));
    if (sortOrder === 'name_asc') processed.sort((a, b) => a.schemeName.localeCompare(b.schemeName));
    if (sortOrder === 'name_desc') processed.sort((a, b) => b.schemeName.localeCompare(a.schemeName));
    setFilteredSchemes(processed);
    setCurrentPage(1);
  }, [search, schemes, sortOrder]);

  const totalPages = Math.ceil(filteredSchemes.length / schemesPerPage);
  const startIndex = (currentPage - 1) * schemesPerPage;
  const currentSchemes = filteredSchemes.slice(startIndex, startIndex + schemesPerPage);

  if (loading) return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#000', color: '#00FF7F' }}>
      <CircularProgress sx={{ color: '#00FF7F' }} />
      <Typography variant="h6" sx={{ mt: 2 }}>Loading Active Schemes...</Typography>
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(180deg,  #000)', color: '#00FF7F', display: 'flex', flexDirection: 'column' }}>
      {/* ===== Main Content ===== */}
      <Container maxWidth="lg" sx={{ flex: 1, py: 4 }}>
        <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
          Active Mutual Funds
        </Typography>
        <Typography variant="body1" align="center" mb={4} sx={{ color: '#90EE90' }}>
          Found {filteredSchemes.length} active funds today.
        </Typography>

        {/* Search & Sort */}
        <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2, backgroundColor: 'rgba(0,0,0,0.6)', border: '1px solid #00FF7F' }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label="Search by Fund Name"
                variant="outlined"
                value={search}
                onChange={e => setSearch(e.target.value)}
                InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1, color: '#00FF7F' }} /> }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#00FF7F',
                    '& fieldset': { borderColor: '#00FF7F' },
                    '&:hover fieldset': { borderColor: '#32CD32' },
                    '&.Mui-focused fieldset': { borderColor: '#00FF7F' },
                  },
                  '& .MuiInputLabel-root': { color: '#00FF7F' },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#00FF7F' },
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth sx={{ '& .MuiInputLabel-root': { color: '#00FF7F' }, '& .MuiOutlinedInput-root': { color: '#00FF7F', '& fieldset': { borderColor: '#00FF7F' } } }}>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortOrder}
                  label="Sort By"
                  onChange={e => setSortOrder(e.target.value)}
                  sx={{ color: '#00FF7F', '& .MuiSvgIcon-root': { color: '#00FF7F' } }}
                >
                  <MenuItem value="name_asc">Name (A-Z)</MenuItem>
                  <MenuItem value="name_desc">Name (Z-A)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

        {/* Fund Cards */}
        {currentSchemes.length === 0 ? (
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
              color: '#90EE90',
            }}
          >
            <Typography variant="h6">
              {search ? 'No active funds found matching your search.' : 'No active funds available today.'}
            </Typography>
            {search && (
              <Button
                variant="contained"
                sx={{
                  mt: 3,
                  backgroundColor: '#00FF7F',
                  color: '#000',
                  '&:hover': { backgroundColor: '#00cc6a' },
                }}
                onClick={() => setSearch('')}
              >
                Clear Search
              </Button>
            )}
          </Box>
        ) : (
          <>
            <Typography variant="body1" sx={{ color: '#90EE90', mb: 3 }}>
              Showing {currentSchemes.length} of {filteredSchemes.length} active funds
            </Typography>
            <Grid container spacing={3}>
          {currentSchemes.map(s => (
            <Grid item xs={12} sm={6} md={4} key={s.schemeCode}>
              <Card
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '100%',
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  border: '1px solid #00FF7F',
                  borderRadius: 4,
                  '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 0 25px #00FF7F' },
                }}
              >
                <CardContent>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#00FF7F', mb: 0.5 }}>{s.schemeName}</Typography>
                  <Typography variant="caption" sx={{ color: '#90EE90' }}>Scheme Code: {s.schemeCode}</Typography>
                </CardContent>
                <Box sx={{ p: 2, pt: 0 }}>
                  <Button component={Link} href={`/funds/${s.schemeCode}`} variant="contained" fullWidth sx={{ backgroundColor: '#00FF7F', color: '#000', '&:hover': { backgroundColor: '#32CD32' } }}>
                    View Details
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
            </Grid>
          </>
        )}

        {/* ===== Neon Pagination ===== */}
        {totalPages > 1 && (
          <Box display="flex" justifyContent="center" mt={5}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(e, page) => setCurrentPage(page)}
              sx={{
                '& .MuiPaginationItem-root': {
                  color: '#00FF7F',
                  border: '1px solid #00FF7F',
                  '&:hover': { backgroundColor: 'rgba(0,255,127,0.2)' },
                },
                '& .Mui-selected': { backgroundColor: '#00FF7F !important', color: '#000 !important' },
              }}
            />
          </Box>
        )}
      </Container>
    </Box>
  );
}
