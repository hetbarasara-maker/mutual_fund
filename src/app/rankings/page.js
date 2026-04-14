"use client";

import {
  Box,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RankingsPage() {
  const router = useRouter();
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch funds and keep top 10 only
  useEffect(() => {
    async function fetchRankings() {
      try {
        const res = await fetch("/api/mf");
        const data = await res.json();

        // Optional: sort by 3-year or 1-year returns if available
        const sorted = data
          .sort((a, b) => (b.lastYearReturn || 0) - (a.lastYearReturn || 0))
          .slice(0, 10); // ✅ only top 10

        setRankings(sorted);
      } catch (err) {
        console.error("Error fetching funds:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchRankings();
  }, []);

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
        minHeight: "100vh",
        backgroundColor: "#000",
        color: "#00FF7F",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ===== Main Content ===== */}
      <Container maxWidth="lg" sx={{ flex: 1, py: { xs: 4, sm: 8 }, px: { xs: 2, sm: 4 } }}>
        <Typography
          variant="h3"
          fontWeight="bold"
          align="center"
          sx={{ 
            mb: { xs: 4, sm: 6 }, 
            color: "#00FF7F",
            fontSize: { xs: "2rem", sm: "3.5rem" }
          }}
        >
          🏆 Top 10 Mutual Funds
        </Typography>

        {rankings.length === 0 ? (
          <Typography align="center" color="#90EE90">
            No data available.
          </Typography>
        ) : (
          <>
            <TableContainer
              component={Paper}
              sx={{
                backgroundColor: "#111",
                border: "1px solid #00FF7F",
                color: "#7CFC00",
                boxShadow: "0 0 20px rgba(0,255,127,0.2)",
                borderRadius: 3,
                overflowX: "auto", // Ensure horizontal scroll on mobile
                "&::-webkit-scrollbar": {
                  height: "6px",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#00FF7F",
                  borderRadius: "10px",
                },
              }}
            >
              <Table sx={{ minWidth: { xs: 600, md: 800 } }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: "#00FF7F", fontWeight: "bold", borderBottom: "1px solid rgba(0,255,127,0.3)" }}>Rank</TableCell>
                    <TableCell sx={{ color: "#00FF7F", fontWeight: "bold", borderBottom: "1px solid rgba(0,255,127,0.3)" }}>Fund Name</TableCell>
                    <TableCell sx={{ color: "#00FF7F", fontWeight: "bold", borderBottom: "1px solid rgba(0,255,127,0.3)", display: { xs: "none", sm: "table-cell" } }}>Fund House</TableCell>
                    <TableCell sx={{ color: "#00FF7F", fontWeight: "bold", borderBottom: "1px solid rgba(0,255,127,0.3)", display: { xs: "none", md: "table-cell" } }}>Category</TableCell>
                    <TableCell sx={{ color: "#00FF7F", fontWeight: "bold", borderBottom: "1px solid rgba(0,255,127,0.3)" }}>Return (%)</TableCell>
                    <TableCell sx={{ color: "#00FF7F", fontWeight: "bold", borderBottom: "1px solid rgba(0,255,127,0.3)" }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rankings.map((fund, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        "&:hover": { backgroundColor: "rgba(0,255,127,0.1)" },
                        color: "#7CFC00",
                      }}
                    >
                      <TableCell sx={{ color: "#7CFC00", borderBottom: "1px solid rgba(0,255,127,0.1)" }}>{index + 1}</TableCell>
                      <TableCell sx={{ color: "#7CFC00", borderBottom: "1px solid rgba(0,255,127,0.1)", fontWeight: "bold" }}>{fund.schemeName}</TableCell>
                      <TableCell sx={{ color: "#7CFC00", borderBottom: "1px solid rgba(0,255,127,0.1)", display: { xs: "none", sm: "table-cell" } }}>{fund.fundHouse || "N/A"}</TableCell>
                      <TableCell sx={{ color: "#7CFC00", borderBottom: "1px solid rgba(0,255,127,0.1)", display: { xs: "none", md: "table-cell" } }}>{fund.category || "N/A"}</TableCell>
                      <TableCell sx={{ color: "#00FF7F", borderBottom: "1px solid rgba(0,255,127,0.1)", fontWeight: "bold" }}>
                        {fund.lastYearReturn?.toFixed(2) || "—"}%
                      </TableCell>
                      <TableCell sx={{ borderBottom: "1px solid rgba(0,255,127,0.1)" }}>
                        <Button
                          variant="contained"
                          size="small"
                          sx={{
                            backgroundColor: "#00FF7F",
                            color: "#000",
                            textTransform: "none",
                            fontWeight: "bold",
                            borderRadius: 2,
                            "&:hover": { backgroundColor: "#32CD32" },
                          }}
                          onClick={() => router.push(`/funds/${fund.schemeCode}`)}
                        >
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Typography variant="caption" sx={{ color: "#90EE90", mt: 2, display: { xs: "block", sm: "none" }, textAlign: "center" }}>
              ← Scroll horizontally to see more →
            </Typography>
          </>
        )}
      </Container>
    </Box>
  );
}
