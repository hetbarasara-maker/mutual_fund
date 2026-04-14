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

  // 🔍 Filter by Search
  useEffect(() => {
    if (!Array.isArray(funds)) {
      setFilteredFunds([]);
      return;
    }
    const filtered = funds.filter((fund) =>
      fund.schemeName.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredFunds(filtered);
    setPage(1);
  }, [search, funds]);

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
      <Container maxWidth="lg" sx={{ flex: 1, py: 8 }}>
        <Typography
          variant="h3"
          fontWeight="bold"
          align="center"
          sx={{ mb: 5, color: "#00FF7F" }}
        >
          Explore Mutual Funds
        </Typography>

        {/* 🔍 Search Box */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 5 }}>
          <TextField
            placeholder="Search by Scheme Name..."
            variant="outlined"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{
              width: "100%",
              maxWidth: 500,
              input: {
                color: "#00FF7F",
                backgroundColor: "#111",
                borderRadius: "8px",
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#00FF7F" },
                "&:hover fieldset": { borderColor: "#32CD32" },
                "&.Mui-focused fieldset": { borderColor: "#00FF7F" },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#00FF7F" }} />
                </InputAdornment>
              ),
            }}
          />
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
            <Typography variant="body1" sx={{ color: "#90EE90", mb: 3 }}>
              Showing {currentFunds.length} of {filteredFunds.length} funds
            </Typography>
            <Grid container spacing={3}>
          {currentFunds.map((fund, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  backgroundColor: "rgba(20, 20, 20, 0.9)",
                  border: "1px solid #00FF7F",
                  color: "#00FF7F",
                  borderRadius: 4,
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  boxShadow: "0 0 12px rgba(0,255,127,0.2)",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 0 25px #00FF7F",
                  },
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    gutterBottom
                    sx={{ color: "#00FF7F" }}
                  >
                    {fund.schemeName}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#90EE90" }}>
                    Scheme Code: {fund.schemeCode}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#90EE90" }}>
                    Fund House: {fund.fundHouse || "N/A"}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#90EE90" }}>
                    Category: {fund.category || "N/A"}
                  </Typography>

                  {/* ✅ Explore Fund Button */}
                  <Button
                    variant="contained"
                    size="small"
                    sx={{
                      mt: 2,
                      backgroundColor: "#00FF7F",
                      color: "#000",
                      borderRadius: "20px",
                      textTransform: "none",
                      fontWeight: 600,
                      "&:hover": { backgroundColor: "#00cc6a" },
                    }}
                    onClick={() => router.push(`/funds/${fund.schemeCode}`)}
                  >
                    Explore Fund
                  </Button>

                  {/* ⭐ Add to Watchlist Button */}
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{
                      mt: 2,
                      ml: 2,
                      color: "#00FF7F",
                      borderColor: "#00FF7F",
                      borderRadius: "20px",
                      textTransform: "none",
                      fontWeight: 600,
                      "&:hover": {
                        backgroundColor: "rgba(0,255,127,0.2)",
                      },
                    }}
                    onClick={() => handleAddToWatchlist(fund)}
                  >
                    ⭐ Add to Watchlist
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
            </Grid>
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
