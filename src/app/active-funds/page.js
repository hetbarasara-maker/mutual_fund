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
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { useRouter } from 'next/navigation';

export default function ActiveFunds() {
  const router = useRouter();
  const [filteredSchemes, setFilteredSchemes] = useState([]);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState('name_asc');
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const schemesPerPage = 24;

  // Debounce search input to avoid hitting API on every keystroke
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1); // Reset to page 1 on new search
    }, 400);

    return () => clearTimeout(handler);
  }, [search]);

  // Fetch schemes from paginated server endpoint
  useEffect(() => {
    setLoading(true);
    const query = new URLSearchParams({
      page: String(currentPage),
      limit: String(schemesPerPage),
      search: debouncedSearch,
      sort: sortOrder
    });

    fetch(`/api/mf/active?${query.toString()}`)
      .then(res => res.json())
      .then(data => {
        setFilteredSchemes(data.data || []);
        setTotalPages(data.pages || 1);
        setTotalCount(data.total || 0);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching schemes:', err);
        setFilteredSchemes([]);
        setTotalPages(1);
        setTotalCount(0);
        setLoading(false);
      });
  }, [currentPage, debouncedSearch, sortOrder]);

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

  // ⭐ Add to Watchlist
  const handleAddToWatchlist = (fund) => {
    const existing = JSON.parse(localStorage.getItem("watchlist")) || [];
    const alreadyAdded = existing.some((f) => f.schemeCode === fund.schemeCode);
    if (alreadyAdded) {
      setSnackbar({ open: true, message: "✅ Already in Watchlist!", severity: "info" });
      return;
    }
    const updated = [...existing, fund];
    localStorage.setItem("watchlist", JSON.stringify(updated));
    setSnackbar({ open: true, message: "⭐ Added to Watchlist!", severity: "success" });
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  const currentSchemes = filteredSchemes;

  if (loading) return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#000', color: '#00FF7F' }}>
      <CircularProgress sx={{ color: '#00FF7F' }} />
      <Typography variant="h6" sx={{ mt: 2 }}>Loading Active Schemes...</Typography>
    </Box>
  );

  return (
    <Box sx={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}>
      {/* Background Elements */}
      <Box 
        sx={{ 
          position: "fixed", 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          zIndex: -1,
          background: "radial-gradient(circle at 50% 50%, #111 0%, #000 100%)",
        }} 
      />
      
      {/* Animated Mesh Grid */}
      <Box 
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1,
          opacity: 0.1,
          backgroundImage: `linear-gradient(#00FF7F 1px, transparent 1px), linear-gradient(90deg, #00FF7F 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse at center, black, transparent 80%)",
        }}
      />

      {/* ===== Main Content ===== */}
      <Container maxWidth="xl" sx={{ flex: 1, py: { xs: 6, sm: 8 }, px: { xs: 2, sm: 4 }, position: "relative", zIndex: 1 }}>
        <Box sx={{ mb: 6, textAlign: "center" }}>
          <Typography
            variant="h2"
            sx={{ 
              fontWeight: 900,
              mb: 1, 
              background: "linear-gradient(135deg, #fff 0%, #00FF7F 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontSize: { xs: "2.5rem", sm: "3.5rem" }
            }}
          >
            Live Market Funds
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.6)', maxWidth: 600, mx: "auto" }}>
            Currently monitoring {totalCount} active mutual fund schemes. 
            Real-time data for informed decision making.
          </Typography>
        </Box>

        {/* Search & Sort Panel */}
        <Box 
          className="glass-card" 
          sx={{ 
            p: { xs: 2.5, sm: 4 }, 
            mb: 8, 
            maxWidth: 900,
            mx: 'auto',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.05)'
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                placeholder="Search funds by name..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                variant="outlined"
                InputProps={{ 
                  startAdornment: <SearchIcon sx={{ mr: 1.5, color: '#00FF7F' }} />,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    borderRadius: 3,
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                    '&:hover fieldset': { borderColor: 'rgba(0, 255, 127, 0.4)' },
                    '&.Mui-focused fieldset': { borderColor: '#00FF7F' },
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <Select
                  value={sortOrder}
                  onChange={e => setSortOrder(e.target.value)}
                  sx={{ 
                    color: '#fff', 
                    borderRadius: 3,
                    bgcolor: 'rgba(255,255,255,0.03)',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(0, 255, 127, 0.4)' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#00FF7F' },
                    '& .MuiSvgIcon-root': { color: '#00FF7F' }
                  }}
                >
                  <MenuItem value="name_asc">Name: A to Z</MenuItem>
                  <MenuItem value="name_desc">Name: Z to A</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>

        {/* Fund Cards Grid */}
        {currentSchemes.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 12 }}>
            <Typography variant="h5" sx={{ color: 'rgba(255,255,255,0.4)', mb: 4 }}>
              No funds match your current search.
            </Typography>
            <Button
              variant="outlined"
              onClick={() => setSearch('')}
              sx={{ color: '#00FF7F', borderColor: '#00FF7F', borderRadius: 2, px: 4 }}
            >
              Reset Search
            </Button>
          </Box>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
                md: "1fr 1fr 1fr",
              },
              gap: 4,
              width: "100%",
            }}
          >
            {currentSchemes.map(s => {
              const details = getDetectedDetails(s.schemeName);
              return (
                <Card
                  key={String(s.schemeCode).trim()}
                  className="glass-card"
                  sx={{
                    height: 420, // Mathematically identical height
                    display: 'flex',
                    flexDirection: 'column',
                    p: 1,
                    background: 'rgba(255, 255, 255, 0.02) !important', 
                    border: '1px solid rgba(255,255,255,0.08)',
                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    '&:hover': {
                      transform: 'translateY(-12px)',
                      background: 'rgba(0, 255, 127, 0.05) !important',
                      borderColor: 'rgba(0, 255, 127, 0.4)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                    }
                  }}
                >
                  <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="caption" sx={{ color: '#00FF7F', fontWeight: 800 }}>
                        #{s.schemeCode}
                      </Typography>
                      <Box sx={{ bgcolor: 'rgba(0, 255, 127, 0.1)', px: 1, py: 0.2, borderRadius: 1 }}>
                        <Typography variant="caption" sx={{ color: '#00FF7F', fontWeight: 800 }}>
                          {details.category}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 800,
                        color: '#fff',
                        mb: 4,
                        lineHeight: 1.3,
                        height: '2.6em',
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {s.schemeName}
                    </Typography>

                    <Box sx={{ bgcolor: 'rgba(255,255,255,0.02)', p: 1.5, borderRadius: 2, mt: 'auto' }}>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block', mb: 0.5, fontWeight: 500 }}>FUND HOUSE</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#fff' }}>{details.house}</Typography>
                    </Box>
                  </CardContent>

                  <Box sx={{ p: 2, mt: 'auto', display: 'flex', gap: 2 }}>
                    <Button
                      component={Link}
                      href={`/funds/${s.schemeCode}`}
                      variant="contained"
                      fullWidth
                      sx={{
                        bgcolor: '#00FF7F',
                        color: '#000',
                        fontWeight: 900,
                        borderRadius: 3,
                        textTransform: 'none',
                        py: 1.2,
                        '&:hover': { bgcolor: '#00e672' }
                      }}
                    >
                      Analyze
                    </Button>
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={() => handleAddToWatchlist(s)}
                      sx={{
                        borderColor: "rgba(255,255,255,0.1)",
                        color: "#fff",
                        borderRadius: 3,
                        fontWeight: 600,
                        textTransform: "none",
                        "&:hover": { borderColor: "#00FF7F", color: "#00FF7F", bgcolor: "rgba(0,255,127,0.05)" }
                      }}
                    >
                      Watchlist
                    </Button>
                  </Box>
                </Card>
              );
            })}
          </Box>
        )}

        {/* 🔔 Notifications */}
        <Snackbar 
          open={snackbar.open} 
          autoHideDuration={3000} 
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbar.severity} 
            variant="filled" 
            className="glass-card"
            sx={{ 
              width: '100%', 
              backgroundColor: snackbar.severity === 'success' ? 'rgba(0, 255, 127, 0.9)' : 'rgba(50, 50, 50, 0.9)', 
              color: snackbar.severity === 'success' ? '#000' : '#fff',
              fontWeight: 'bold',
              border: "1px solid rgba(255,255,255,0.1)"
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>

        {/* Pagination */}
        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(e, page) => setCurrentPage(page)}
              sx={{
                '& .MuiPaginationItem-root': {
                  color: 'rgba(255,255,255,0.6)',
                  fontWeight: 800,
                  fontSize: '1rem',
                  border: '1px solid rgba(255,255,255,0.1)',
                  '&:hover': { bgcolor: 'rgba(0, 255, 127, 0.1)', color: '#00FF7F' },
                },
                '& .Mui-selected': { 
                  bgcolor: '#00FF7F !important', 
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
