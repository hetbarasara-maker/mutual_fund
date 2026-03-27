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
      <Container sx={{ flex: 1, py: 6 }}>
        <Typography
          variant="h3"
          align="center"
          sx={{
            mb: 5,
            color: "#00FF7F",
            fontWeight: "bold",
          }}
        >
          Your Watchlist 💚
        </Typography>

        {watchlist.length === 0 ? (
          <Typography align="center" sx={{ color: "#90EE90" }}>
            Your watchlist is empty. Go add some funds!
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {watchlist.map((fund) => (
              <Grid item xs={12} sm={6} md={6} key={fund.schemeCode}>
                <Card
                  sx={{
                    backgroundColor: "rgba(20,20,20,0.9)",
                    border: "1px solid #00FF7F",
                    borderRadius: 4,
                    boxShadow: "0 0 20px rgba(0,255,127,0.25)",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.02)",
                      boxShadow: "0 0 25px rgba(0,255,127,0.4)",
                    },
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      gutterBottom
                      sx={{
                        color: "#00FF7F",
                      }}
                    >
                      {fund.schemeName}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#90EE90" }}>
                      Code: {fund.schemeCode}
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mt: 2,
                      }}
                    >
                      <Button
                        variant="contained"
                        size="small"
                        sx={{
                          backgroundColor: "#00FF7F",
                          color: "#000",
                          borderRadius: "20px",
                          fontWeight: "bold",
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
                        size="small"
                        sx={{
                          borderColor: "#00FF7F",
                          color: "#00FF7F",
                          borderRadius: "20px",
                          fontWeight: "bold",
                          "&:hover": {
                            backgroundColor: "rgba(0,255,127,0.1)",
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
