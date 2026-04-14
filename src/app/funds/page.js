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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useRouter } from "next/navigation";

export default function FundsPage() {
  const router = useRouter();
  const [funds, setFunds] = useState([]);
  const [filteredFunds, setFilteredFunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("name_asc");
  const fundsPerPage = 25;

  useEffect(() => {
    async function fetchFunds() {
      try {
        console.log("Fetching funds...");
        const res = await fetch("/api/mf");
        const data = await res.json();
        console.log("API Response:", data);
        // Ensure data is always an array
        const fundsArray = Array.isArray(data) ? data : (data?.data || []);
        console.log(`Loaded ${fundsArray.length} funds`);
        setFunds(fundsArray);
        setFilteredFunds(fundsArray);
      } catch (error) {
        console.error("Error fetching funds:", error);
        setFunds([]);
        setFilteredFunds([]);
      } finally {
        setLoading(false);
      }
    }
    fetchFunds();
  }, []);

  // 🔍 Filter by Search & Sort
  useEffect(() => {
    if (!Array.isArray(funds)) {
      setFilteredFunds([]);
      return;
    }
    let filtered = funds.filter((fund) =>
      fund.schemeName.toLowerCase().includes(search.toLowerCase())
    );

    // Sorting logic
    filtered.sort((a, b) => {
      if (sortOrder === "name_asc") {
        return a.schemeName.localeCompare(b.schemeName);
      } else {
        return b.schemeName.localeCompare(a.schemeName);
      }
    });

    setFilteredFunds(filtered);
    setPage(1);
  }, [search, funds, sortOrder]);

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
      alert("✅ Already in Watchlist!");
      return;
    }
    const updated = [...existing, fund];
    localStorage.setItem("watchlist", JSON.stringify(updated));
    alert("⭐ Added to Watchlist!");
  };

  const indexOfLastFund = page * fundsPerPage;
  const indexOfFirstFund = indexOfLastFund - fundsPerPage;
  const currentFunds = filteredFunds.slice(indexOfFirstFund, indexOfLastFund);
  const totalPages = Math.ceil(filteredFunds.length / fundsPerPage);

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
    <Box
      sx={{
        backgroundColor: "#000",
        minHeight: "100vh",
        color: "#00FF7F",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ===== Main Content ===== */}
      <Container maxWidth="xl" sx={{ flex: 1, py: { xs: 4, sm: 8 }, px: { xs: 2, sm: 4 } }}>
        <Typography
          variant="h3"
          fontWeight="bold"
          align="center"
          sx={{ 
            mb: { xs: 4, sm: 5 }, 
            color: "#00FF7F",
            fontSize: { xs: "2rem", sm: "3rem" }
          }}
        >
          Explore Mutual Funds
        </Typography>

        {/* 🔍 Search & Sort Box */}
        <Box 
          sx={{ 
            p: { xs: 2, sm: 3 }, 
            mb: 5, 
            borderRadius: 4, 
            backgroundColor: 'rgba(0,0,0,0.4)', 
            border: '1px solid rgba(0, 255, 127, 0.2)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
            backdropFilter: 'blur(10px)',
            maxWidth: 800,
            mx: 'auto'
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

        {/* ===== Funds Grid ===== */}
        {currentFunds.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: 8,
              color: "#90EE90",
            }}
          >
            <Typography variant="h6">
              {search ? "No funds found matching your search." : "Loading funds..."}
            </Typography>
            {search && (
              <Button
                variant="contained"
                sx={{
                  mt: 3,
                  backgroundColor: "#00FF7F",
                  color: "#000",
                  "&:hover": { backgroundColor: "#00cc6a" },
                }}
                onClick={() => setSearch("")}
              >
                Clear Search
              </Button>
            )}
          </Box>
        ) : (
          <>
            <Typography variant="body1" sx={{ color: "#90EE90", mb: 3, textAlign: { xs: "center", sm: "left" } }}>
              Showing {currentFunds.length} of {filteredFunds.length} funds
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" },
                gap: 3,
              }}
            >
              {currentFunds.map((fund, index) => (
                <Box
                  key={index}
                  sx={{
                    height: 320,
                    display: "flex",
                  }}
                >
                  <Card
                    sx={{
                      width: "100%",
                      height: "100%",
                      backgroundColor: "rgba(10, 10, 10, 0.9)",
                      border: "1px solid rgba(0, 255, 127, 0.25)",
                      borderRadius: 4,
                      display: "flex",
                      flexDirection: "column",
                      transition: "all 0.3s ease",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.6)",
                      overflow: "hidden",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        borderColor: "#00FF7F",
                        boxShadow: "0 8px 30px rgba(0,255,127,0.25)",
                      },
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1, p: 2.5, overflow: "hidden" }}>
                      <Typography
                        fontWeight="bold"
                        sx={{
                          color: "#00FF7F",
                          fontSize: "1rem",
                          lineHeight: 1.4,
                          height: "2.8em",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          mb: 2,
                        }}
                      >
                        {fund.schemeName}
                      </Typography>

                      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.8 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "rgba(255,255,255,0.04)", px: 1.5, py: 0.8, borderRadius: 1.5 }}>
                          <Typography variant="caption" sx={{ color: "#90EE90", opacity: 0.7, letterSpacing: 1 }}>CODE</Typography>
                          <Typography variant="body2" sx={{ color: "#fff", fontWeight: 600 }}>{fund.schemeCode}</Typography>
                        </Box>
                        {(() => {
                           const details = getDetectedDetails(fund.schemeName);
                           return (
                             <>
                              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "rgba(255,255,255,0.04)", px: 1.5, py: 0.8, borderRadius: 1.5 }}>
                                <Typography variant="caption" sx={{ color: "#90EE90", opacity: 0.7, letterSpacing: 1 }}>HOUSE</Typography>
                                <Typography variant="body2" sx={{ color: "#fff", fontWeight: 600, maxWidth: "60%", textAlign: "right", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                  {fund.fundHouse || details.house}
                                </Typography>
                              </Box>
                              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "rgba(255,255,255,0.04)", px: 1.5, py: 0.8, borderRadius: 1.5 }}>
                                <Typography variant="caption" sx={{ color: "#90EE90", opacity: 0.7, letterSpacing: 1 }}>CATEGORY</Typography>
                                <Typography variant="body2" sx={{ color: "#fff", fontWeight: 600, maxWidth: "60%", textAlign: "right", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                  {fund.category || details.category}
                                </Typography>
                              </Box>
                             </>
                           )
                        })()}
                      </Box>
                    </CardContent>

                    <Box sx={{ px: 2.5, pb: 2.5, display: "flex", gap: 1.5, mt: "auto" }}>
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={() => router.push(`/funds/${fund.schemeCode}`)}
                        sx={{
                          backgroundColor: "#00FF7F",
                          color: "#000",
                          borderRadius: "10px",
                          textTransform: "none",
                          fontWeight: "bold",
                          py: 1,
                          fontSize: "0.85rem",
                          "&:hover": { backgroundColor: "#00cc6a", boxShadow: "0 0 12px #00FF7F" },
                        }}
                      >
                        Explore
                      </Button>
                      <Button
                        variant="outlined"
                        fullWidth
                        onClick={() => handleAddToWatchlist(fund)}
                        sx={{
                          color: "#00FF7F",
                          borderColor: "rgba(0, 255, 127, 0.4)",
                          borderRadius: "10px",
                          textTransform: "none",
                          fontWeight: "bold",
                          py: 1,
                          fontSize: "0.85rem",
                          "&:hover": {
                            borderColor: "#00FF7F",
                            backgroundColor: "rgba(0,255,127,0.1)",
                          },
                        }}
                      >
                        Watchlist
                      </Button>
                    </Box>
                  </Card>
                </Box>
              ))}
            </Box>
          </>
        )}

        {/* ===== Pagination ===== */}
        {totalPages > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(e, value) => setPage(value)}
              sx={{
                "& .MuiPaginationItem-root": {
                  color: "#00FF7F",
                  border: "1px solid #00FF7F",
                  fontWeight: "bold",
                  "&:hover": {
                    backgroundColor: "rgba(0,255,127,0.2)",
                    transform: "scale(1.05)",
                  },
                },
                "& .Mui-selected": {
                  backgroundColor: "#00FF7F !important",
                  color: "#000 !important",
                },
              }}
            />
          </Box>
        )}
      </Container>
    </Box>
  );
}
