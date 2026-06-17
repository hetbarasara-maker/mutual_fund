'use client';

import { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Pagination,
  Box,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  Stack,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useRouter } from "next/navigation";

export default function FundsPage() {
  const router = useRouter();
  const [filteredFunds, setFilteredFunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("name_asc");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const fundsPerPage = 25;

  // Debounce search input to avoid hitting API on every keystroke
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to page 1 on new search
    }, 400);

    return () => clearTimeout(handler);
  }, [search]);

  // Fetch paginated funds from the server
  useEffect(() => {
    async function fetchFunds() {
      setLoading(true);
      try {
        const query = new URLSearchParams({
          page: String(page),
          limit: String(fundsPerPage),
          search: debouncedSearch,
          sort: sortOrder
        });
        const res = await fetch(`/api/mf?${query.toString()}`);
        const data = await res.json();
        setFilteredFunds(data.data || []);
        setTotalPages(data.pages || 1);
        setTotalCount(data.total || 0);
      } catch (error) {
        console.error("Error fetching funds:", error);
        setFilteredFunds([]);
        setTotalPages(1);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    }
    fetchFunds();
  }, [page, debouncedSearch, sortOrder]);

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

  const currentFunds = filteredFunds;

  if (loading) {
    return (
      <Box
        sx={{
          backgroundColor: "#000",
          color: "#00FF7F",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress sx={{ color: "#00FF7F" }} />
      </Box>
    );
  }

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
      <Container maxWidth="xl" sx={{ flex: 1, py: { xs: 4, sm: 8 }, px: { xs: 2, sm: 4 }, position: "relative", zIndex: 1 }}>
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
            Market Explorer
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.6)', maxWidth: 600, mx: "auto" }}>
            Discovery hub for {totalCount} verified mutual fund schemes. 
            Analyze and track with ultimate precision.
          </Typography>
        </Box>

        {/* 🔍 Search & Sort Box */}
        <Box 
          className="glass-card"
          sx={{ 
            p: { xs: 2, sm: 4 }, 
            mb: 8, 
            maxWidth: 900,
            mx: 'auto',
            border: '1px solid rgba(0, 255, 127, 0.15)',
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} sm={8}>
              <TextField
                fullWidth
                placeholder="Search by fund name..."
                variant="outlined"
                value={search}
                onChange={e => setSearch(e.target.value)}
                InputProps={{ 
                  startAdornment: <SearchIcon sx={{ mr: 1.5, color: '#00FF7F', opacity: 0.7 }} />,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    borderRadius: 3,
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    px: 1,
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                    '&:hover fieldset': { borderColor: 'rgba(0, 255, 127, 0.5)' },
                    '&.Mui-focused fieldset': { borderColor: '#00FF7F' },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl 
                fullWidth 
                sx={{ 
                  '& .MuiOutlinedInput-root': { 
                    color: '#fff', 
                    borderRadius: 3,
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                    '&:hover fieldset': { borderColor: 'rgba(0, 255, 127, 0.5)' },
                    '&.Mui-focused fieldset': { borderColor: '#00FF7F' },
                  } 
                }}
              >
                <InputLabel sx={{ color: "rgba(255,255,255,0.5)" }}>Order By</InputLabel>
                <Select
                  value={sortOrder}
                  label="Order By"
                  onChange={e => setSortOrder(e.target.value)}
                  sx={{ '& .MuiSvgIcon-root': { color: '#00FF7F' } }}
                >
                  <MenuItem value="name_asc">Name (A-Z)</MenuItem>
                  <MenuItem value="name_desc">Name (Z-A)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>

        {/* ===== Funds Grid ===== */}
        {currentFunds.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 12 }}>
            <Typography variant="h5" color="rgba(255,255,255,0.4)">
              No matching funds discovered.
            </Typography>
            <Button
              variant="text"
              sx={{ mt: 2, color: "#00FF7F" }}
              onClick={() => setSearch("")}
            >
              Reset Search Filter
            </Button>
          </Box>
        ) : (
          <>
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
              {currentFunds.map((fund, index) => {
                const details = getDetectedDetails(fund.schemeName);
                return (
                  <Card
                    key={index}
                    className="glass-card"
                    sx={{
                      height: 420, // Mathematically identical height
                      display: "flex",
                      flexDirection: "column",
                      p: 1,
                      background: "rgba(255, 255, 255, 0.02) !important",
                      border: "1px solid rgba(255,255,255,0.08)",
                      transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                      "&:hover": {
                        transform: "translateY(-10px)",
                        background: "rgba(0, 255, 127, 0.05) !important",
                        borderColor: "rgba(0, 255, 127, 0.4)",
                        boxShadow: "0 20px 40px rgba(0,0,0,0.4)"
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3, flex: 1, display: "flex", flexDirection: "column" }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                        <Typography variant="caption" sx={{ color: "#00FF7F", fontWeight: "bold", letterSpacing: 1 }}>
                          {fund.schemeCode}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.3)" }}>
                          ID: {String(fund.schemeCode).slice(-4)}
                        </Typography>
                      </Box>
                      
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 800,
                          color: "#fff",
                          mb: 3,
                          lineHeight: 1.3,
                          height: "2.6em",
                          overflow: "hidden",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {fund.schemeName}
                      </Typography>

                      <Stack spacing={1.5} sx={{ mt: 'auto' }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: "rgba(255,255,255,0.02)", p: 1.5, borderRadius: 2 }}>
                          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.5)" }}>FUND HOUSE</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: "#fff" }}>{fund.fundHouse || details.house}</Typography>
                        </Box>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: "rgba(255,255,255,0.02)", p: 1.5, borderRadius: 2 }}>
                          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.5)" }}>CATEGORY</Typography>
                          <Box sx={{ bgcolor: "rgba(0, 255, 127, 0.1)", px: 1, py: 0.2, borderRadius: 1 }}>
                            <Typography variant="caption" sx={{ color: "#00FF7F", fontWeight: "bold" }}>
                              {fund.category || details.category}
                            </Typography>
                          </Box>
                        </Box>
                      </Stack>
                    </CardContent>

                    <Box sx={{ p: 2, display: "flex", gap: 2, mt: 'auto' }}>
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={() => router.push(`/funds/${fund.schemeCode}`)}
                        sx={{
                          bgcolor: "#00FF7F",
                          color: "#000",
                          borderRadius: 3,
                          fontWeight: 800,
                          textTransform: "none",
                          py: 1.2,
                          "&:hover": { bgcolor: "#00e672", boxShadow: "0 0 20px rgba(0, 255, 127, 0.4)" }
                        }}
                      >
                        Analyze
                      </Button>
                      <Button
                        variant="outlined"
                        fullWidth
                        onClick={() => handleAddToWatchlist(fund)}
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

            {/* ===== Pagination ===== */}
            {totalPages > 1 && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 10, mb: 4 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(e, value) => setPage(value)}
                  sx={{
                    "& .MuiPaginationItem-root": {
                      color: "rgba(255,255,255,0.5)",
                      borderRadius: 2,
                      border: "1px solid rgba(255,255,255,0.1)",
                      "&:hover": {
                        backgroundColor: "rgba(0,255,127,0.1)",
                        color: "#00FF7F",
                        borderColor: "#00FF7F",
                      },
                    },
                    "& .Mui-selected": {
                      backgroundColor: "#00FF7F !important",
                      color: "#000 !important",
                      fontWeight: "bold",
                    },
                  }}
                />
              </Box>
            )}
          </>
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
      </Container>
    </Box>
  );
}
