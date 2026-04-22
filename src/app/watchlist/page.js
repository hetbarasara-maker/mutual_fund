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
    <Box
      sx={{
        backgroundColor: "#000",
        color: "#00FF7F",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ===== Main Content ===== */}
      <Container maxWidth="xl" sx={{ flex: 1, py: { xs: 4, sm: 8 }, px: { xs: 2, sm: 4 } }}>
        <Typography
          variant="h3"
          align="center"
          sx={{
            mb: { xs: 4, sm: 6 },
            color: "#00FF7F",
            fontWeight: "bold",
            fontSize: { xs: "2rem", sm: "3.5rem" }
          }}
        >
          Your Watchlist 💚
        </Typography>

        {watchlist.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h6" sx={{ color: "#90EE90", mb: 3 }}>
              Your watchlist is empty. Go add some funds!
            </Typography>
            <Button 
               variant="contained" 
               sx={{ backgroundColor: "#00FF7F", color: "#000", fontWeight: "bold", borderRadius: 3 }}
               onClick={() => router.push("/funds")}
            >
              Explore Funds
            </Button>
          </Box>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
              gap: 3,
            }}
          >
            {watchlist.map((fund, index) => (
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
                        );
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
                      onClick={() => removeFund(fund.schemeCode)}
                      sx={{
                        color: "#FF4D4D",
                        borderColor: "rgba(255, 77, 77, 0.4)",
                        borderRadius: "10px",
                        textTransform: "none",
                        fontWeight: "bold",
                        py: 1,
                        fontSize: "0.85rem",
                        "&:hover": {
                          borderColor: "#FF4D4D",
                          backgroundColor: "rgba(255, 77, 77, 0.1)",
                        },
                      }}
                    >
                      Remove
                    </Button>
                  </Box>
                </Card>
              </Box>
            ))}
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
            sx={{ 
              width: '100%', 
              backgroundColor: snackbar.severity === 'error' ? '#FF4D4D' : '#333', 
              color: '#fff',
              fontWeight: 'bold',
              borderRadius: 2
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}
