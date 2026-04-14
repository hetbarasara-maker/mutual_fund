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

  // 🏥 Helper to Guess Fund House and Category from Name
  const getDetectedDetails = (name) => {
    const n = name.toUpperCase();
    let house = "Other";
    let category = "Mutual Fund";

    // Detect House
    if (n.includes("HDFC")) house = "HDFC Mutual Fund";
    else if (n.includes("ICICI") || n.includes("PRUDENTIAL")) house = "ICICI Prudential";
    else if (n.includes("SBI")) house = "SBI Mutual Fund";
    else if (n.includes("AXIS")) house = "Axis Mutual Fund";
    else if (n.includes("NIPPON")) house = "Nippon India";
    else if (n.includes("KOTAK")) house = "Kotak Mutual Fund";
    else if (n.includes("TATA")) house = "Tata Mutual Fund";
    else if (n.includes("UTI")) house = "UTI Mutual Fund";
    else if (n.includes("DSP")) house = "DSP Mutual Fund";
    else if (n.includes("QUANT")) house = "Quant Mutual Fund";
    else if (n.includes("MIRAE")) house = "Mirae Asset";
    else if (n.includes("ADITYA BIRLA") || n.includes("ABSL")) house = "Aditya Birla";
    else if (n.includes("NIPPON")) house = "Nippon India";
    else if (n.includes("FRANKLIN") || n.includes("TEMPLETON")) house = "Franklin Templeton";
    else if (n.includes("CANARA") || n.includes("ROBECO")) house = "Canara Robeco";
    else if (n.includes("EDELWEISS")) house = "Edelweiss MF";
    else if (n.includes("IDFC") || n.includes("BANDHAN")) house = "Bandhan Mutual Fund";
    else if (n.includes("PARAG PARIKH") || n.includes("PPFAS")) house = "Parag Parikh";
    else if (n.includes("LIC")) house = "LIC Mutual Fund";
    else if (n.includes("ABN AMRO")) house = "ABN AMRO";
    else if (n.includes("HSBC")) house = "HSBC Mutual Fund";
    else if (n.includes("INVESCO")) house = "Invesco India";
    else if (n.includes("SUNDARAM")) house = "Sundaram MF";

    // Detect Category
    if (n.includes("EQUITY")) category = "Equity";
    else if (n.includes("DEBT")) category = "Debt";
    else if (n.includes("HYBRID")) category = "Hybrid";
    else if (n.includes("INDEX")) category = "Index Fund";
    else if (n.includes("ETF")) category = "ETF";
    else if (n.includes("LIQUID")) category = "Liquid Fund";
    else if (n.includes("ELSS") || n.includes("TAX")) category = "ELSS (Tax Saver)";
    else if (n.includes("GOLD")) category = "Gold Fund";
    else if (n.includes("LARGE CAP")) category = "Large Cap";
    else if (n.includes("MID CAP")) category = "Mid Cap";
    else if (n.includes("SMALL CAP")) category = "Small Cap";
    else if (n.includes("FLEXI CAP")) category = "Flexi Cap";
    else if (n.includes("OVERNIGHT")) category = "Overnight Fund";

    return { house, category };
  };

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
      <Container maxWidth="xl" sx={{ flex: 1, py: { xs: 4, sm: 6 }, px: { xs: 2, sm: 4 } }}>
        <Typography 
          variant="h3" 
          align="center" 
          gutterBottom 
          sx={{ 
            fontWeight: 'bold', 
            mb: 2,
            fontSize: { xs: "2rem", sm: "3.5rem" }
          }}
        >
          Active Mutual Funds
        </Typography>
        <Typography variant="body1" align="center" mb={4} sx={{ color: '#90EE90', fontSize: { xs: '0.9rem', sm: '1.1rem' } }}>
          Found {filteredSchemes.length} active funds today.
        </Typography>

        {/* Search & Sort */}
        <Box 
          sx={{ 
            p: { xs: 2, sm: 3 }, 
            mb: 5, 
            borderRadius: 4, 
            backgroundColor: 'rgba(0,0,0,0.4)', 
            border: '1px solid rgba(0, 255, 127, 0.2)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Grid container spacing={1.5} alignItems="flex-end">
            <Grid item xs={7} sm={8}>
              <TextField
                fullWidth
                placeholder="Search..."
                label="Search by Name"
                variant="outlined"
                size="small"
                value={search}
                onChange={e => setSearch(e.target.value)}
                InputProps={{ 
                  startAdornment: <SearchIcon sx={{ mr: 0.5, color: '#00FF7F', fontSize: '1.2rem' }} />,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#00FF7F',
                    borderRadius: 2,
                    backgroundColor: 'rgba(0,0,0,0.3)',
                    fontSize: { xs: '0.85rem', sm: '1rem' },
                    '& fieldset': { borderColor: 'rgba(0, 255, 127, 0.3)' },
                    '&:hover fieldset': { borderColor: '#00FF7F' },
                    '&.Mui-focused fieldset': { borderColor: '#00FF7F', borderWidth: 1.5 },
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(0, 255, 127, 0.7)', fontSize: { xs: '0.85rem', sm: '1rem' } },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#00FF7F' },
                }}
              />
            </Grid>
            <Grid item xs={5} sm={4}>
              <FormControl 
                fullWidth 
                size="small"
                sx={{ 
                  '& .MuiInputLabel-root': { color: 'rgba(0, 255, 127, 0.7)', fontSize: { xs: '0.85rem', sm: '1rem' } }, 
                  '& .MuiOutlinedInput-root': { 
                    color: '#00FF7F', 
                    borderRadius: 2,
                    backgroundColor: 'rgba(0,0,0,0.3)',
                    fontSize: { xs: '0.85rem', sm: '1rem' },
                    '& fieldset': { borderColor: 'rgba(0, 255, 127, 0.3)' },
                    '&:hover fieldset': { borderColor: '#00FF7F' },
                    '&.Mui-focused fieldset': { borderColor: '#00FF7F', borderWidth: 1.5 },
                  } 
                }}
              >
                <InputLabel>Sort</InputLabel>
                <Select
                  value={sortOrder}
                  label="Sort"
                  onChange={e => setSortOrder(e.target.value)}
                  sx={{ color: '#00FF7F', '& .MuiSvgIcon-root': { color: '#00FF7F' } }}
                >
                  <MenuItem value="name_asc" sx={{ fontSize: '0.9rem' }}>A-Z</MenuItem>
                  <MenuItem value="name_desc" sx={{ fontSize: '0.9rem' }}>Z-A</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>

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
            <Typography variant="body1" sx={{ color: '#90EE90', mb: 3, textAlign: { xs: 'center', sm: 'left' } }}>
              Showing {startIndex + 1}-{Math.min(startIndex + currentSchemes.length, filteredSchemes.length)} of {filteredSchemes.length} funds
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' },
                gap: 3,
              }}
            >
              {currentSchemes.map(s => (
                <Box
                  key={s.schemeCode}
                  sx={{ height: 320, display: 'flex' }}
                >
                  <Card
                    sx={{
                      width: '100%',
                      height: '100%',
                      backgroundColor: 'rgba(10, 10, 10, 0.9)',
                      border: '1px solid rgba(0, 255, 127, 0.25)',
                      borderRadius: 4,
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
                      overflow: 'hidden',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        borderColor: '#00FF7F',
                        boxShadow: '0 8px 30px rgba(0,255,127,0.25)',
                      },
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1, p: 2.5, overflow: 'hidden' }}>
                      <Typography
                        fontWeight="bold"
                        sx={{
                          color: '#00FF7F',
                          fontSize: '1rem',
                          lineHeight: 1.4,
                          height: '2.8em',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          mb: 1.5,
                        }}
                      >
                        {s.schemeName}
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.04)', px: 1.5, py: 0.8, borderRadius: 1.5 }}>
                          <Typography variant="caption" sx={{ color: '#90EE90', opacity: 0.7, letterSpacing: 1 }}>CODE</Typography>
                          <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600 }}>{s.schemeCode}</Typography>
                        </Box>
                        {(() => {
                           const details = getDetectedDetails(s.schemeName);
                           return (
                             <>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.04)', px: 1.5, py: 0.8, borderRadius: 1.5 }}>
                                <Typography variant="caption" sx={{ color: '#90EE90', opacity: 0.7, letterSpacing: 1 }}>HOUSE</Typography>
                                <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600, maxWidth: "60%", textAlign: "right", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                  {details.house}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.04)', px: 1.5, py: 0.8, borderRadius: 1.5 }}>
                                <Typography variant="caption" sx={{ color: '#90EE90', opacity: 0.7, letterSpacing: 1 }}>CATEGORY</Typography>
                                <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600, maxWidth: "60%", textAlign: "right", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                  {details.category}
                                </Typography>
                              </Box>
                             </>
                           )
                        })()}
                      </Box>
                    </CardContent>
                    <Box sx={{ px: 2.5, pb: 2.5, mt: 'auto' }}>
                      <Button
                        component={Link}
                        href={`/funds/${s.schemeCode}`}
                        variant="contained"
                        fullWidth
                        sx={{
                          backgroundColor: '#00FF7F',
                          color: '#000',
                          fontWeight: 'bold',
                          borderRadius: '10px',
                          textTransform: 'none',
                          fontSize: '0.85rem',
                          py: 1,
                          '&:hover': { backgroundColor: '#00cc6a', boxShadow: '0 0 12px #00FF7F' },
                        }}
                      >
                        View Details
                      </Button>
                    </Box>
                  </Card>
                </Box>
              ))}
            </Box>
          </>
        )}

        {/* ===== Neon Pagination ===== */}
        {totalPages > 1 && (
          <Box display="flex" justifyContent="center" mt={6}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(e, page) => setCurrentPage(page)}
              sx={{
                '& .MuiPaginationItem-root': {
                  color: '#00FF7F',
                  border: '1px solid #00FF7F',
                  fontWeight: 'bold',
                  '&:hover': { backgroundColor: 'rgba(0,255,127,0.2)' },
                },
                '& .Mui-selected': { 
                  backgroundColor: '#00FF7F !important', 
                  color: '#000 !important' 
                },
              }}
            />
          </Box>
        )}
      </Container>
    </Box>
  );
}
