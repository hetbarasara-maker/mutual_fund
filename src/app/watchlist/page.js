"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Snackbar,
  Alert,
  Stack,
} from "@mui/material";
import { useRouter } from "next/navigation";

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const router = useRouter();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("watchlist")) || [];
    setWatchlist(stored);
  }, []);

  const removeFund = (code) => {
    const updated = watchlist.filter((f) => f.schemeCode !== code);
    setWatchlist(updated);
    localStorage.setItem("watchlist", JSON.stringify(updated));
    setSnackbar({ open: true, message: "🗑️ Removed from Watchlist", severity: "error" });
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

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
    else if (n.includes("FRANKLIN") || n.includes("TEMPLETON")) house = "Franklin Templeton";
    else if (n.includes("CANARA") || n.includes("ROBECO")) house = "Canara Robeco";
    else if (n.includes("EDELWEISS")) house = "Edelweiss MF";
    else if (n.includes("IDFC") || n.includes("BANDHAN")) house = "Bandhan Mutual Fund";
    else if (n.includes("PARAG PARIKH") || n.includes("PPFAS")) house = "Parag Parikh";
    else if (n.includes("LIC")) house = "LIC Mutual Fund";
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
            My Watchlist
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.6)', maxWidth: 600, mx: "auto" }}>
            Tracking your preferred investment opportunities. 
            Analyze or remove schemes to manage your portfolio strategy.
          </Typography>
        </Box>

        {watchlist.length === 0 ? (
          <Box className="glass-card" sx={{ textAlign: "center", py: 12, border: "1px dashed rgba(255,255,255,0.1)" }}>
            <Typography variant="h5" sx={{ color: "rgba(255,255,255,0.4)", mb: 4 }}>
              Your watchlist is currently empty.
            </Typography>
            <Button 
               variant="contained" 
               sx={{ backgroundColor: "#00FF7F", color: "#000", fontWeight: 800, px: 4, py: 1.5, borderRadius: 3, textTransform: "none" }}
               onClick={() => router.push("/funds")}
            >
              Discover Funds
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
            {watchlist.map((fund, index) => {
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
                      <Box sx={{ bgcolor: "rgba(0, 255, 127, 0.1)", px: 1, py: 0.2, borderRadius: 1 }}>
                        <Typography variant="caption" sx={{ color: "#00FF7F", fontWeight: "bold" }}>
                          {fund.category || details.category}
                        </Typography>
                      </Box>
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

                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: "rgba(255,255,255,0.02)", p: 1.5, borderRadius: 2, mt: 'auto' }}>
                      <Typography variant="caption" color="rgba(255,255,255,0.4)">FUND HOUSE</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: "#fff" }}>{fund.fundHouse || details.house}</Typography>
                    </Box>
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
                      onClick={() => removeFund(fund.schemeCode)}
                      sx={{
                        borderColor: "rgba(255, 77, 77, 0.2)",
                        color: "#FF4D4D",
                        borderRadius: 3,
                        fontWeight: 600,
                        textTransform: "none",
                        "&:hover": { borderColor: "#FF4D4D", bgcolor: "rgba(255,77,77,0.05)" }
                      }}
                    >
                      Remove
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
              backgroundColor: snackbar.severity === 'error' ? 'rgba(255, 77, 77, 0.9)' : 'rgba(50, 50, 50, 0.9)', 
              color: '#fff',
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
