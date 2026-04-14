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
} from "@mui/material";
import { useRouter } from "next/navigation";

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("watchlist")) || [];
    setWatchlist(stored);
  }, []);

  const removeFund = (code) => {
    const updated = watchlist.filter((f) => f.schemeCode !== code);
    setWatchlist(updated);
    localStorage.setItem("watchlist", JSON.stringify(updated));
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
      <Container sx={{ flex: 1, py: { xs: 4, sm: 8 } }}>
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
          <Grid container spacing={3}>
            {watchlist.map((fund) => (
              <Grid item xs={12} sm={6} md={4} key={fund.schemeCode}>
                <Card
                  sx={{
                    backgroundColor: "rgba(20,20,20,0.9)",
                    border: "1px solid #00FF7F",
                    borderRadius: 4,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: "0 0 20px rgba(0,255,127,0.25)",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 0 25px rgba(0,255,127,0.4)",
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      gutterBottom
                      sx={{
                        color: "#00FF7F",
                        fontSize: "1.2rem",
                        minHeight: "3.2em"
                      }}
                    >
                      {fund.schemeName}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#90EE90", mb: 2 }}>
                      <strong>Code:</strong> {fund.schemeCode}
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: { xs: "column", lg: "row" },
                        gap: 1,
                        mt: "auto",
                      }}
                    >
                      <Button
                        variant="contained"
                        fullWidth
                        size="small"
                        sx={{
                          backgroundColor: "#00FF7F",
                          color: "#000",
                          borderRadius: "20px",
                          fontWeight: "bold",
                          textTransform: "none",
                          "&:hover": { backgroundColor: "#00cc6a" },
                        }}
                        onClick={() =>
                          router.push(`/funds/${fund.schemeCode}`)
                        }
                      >
                        View Fund
                      </Button>

                      <Button
                        variant="outlined"
                        fullWidth
                        size="small"
                        sx={{
                          borderColor: "#00FF7F",
                          color: "#00FF7F",
                          borderRadius: "20px",
                          fontWeight: "bold",
                          textTransform: "none",
                          "&:hover": {
                            backgroundColor: "rgba(0,255,127,0.2)",
                          },
                        }}
                        onClick={() => removeFund(fund.schemeCode)}
                      >
                        Remove
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}
