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
      <Container maxWidth="lg" sx={{ flex: 1, py: 8 }}>
        <Typography
          variant="h3"
          fontWeight="bold"
          align="center"
          sx={{ mb: 6, color: "#00FF7F" }}
        >
          🏆 Top 10 Mutual Funds
        </Typography>

        {rankings.length === 0 ? (
          <Typography align="center" color="#90EE90">
            No data available.
          </Typography>
        ) : (
          <TableContainer
            component={Paper}
            sx={{
              backgroundColor: "#111",
              border: "1px solid #00FF7F",
              color: "#7CFC00",
              boxShadow: "0 0 20px rgba(0,255,127,0.2)",
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: "#00FF7F", fontWeight: "bold" }}>Rank</TableCell>
                  <TableCell sx={{ color: "#00FF7F", fontWeight: "bold" }}>Fund Name</TableCell>
                  <TableCell sx={{ color: "#00FF7F", fontWeight: "bold" }}>Fund House</TableCell>
                  <TableCell sx={{ color: "#00FF7F", fontWeight: "bold" }}>Category</TableCell>
                  <TableCell sx={{ color: "#00FF7F", fontWeight: "bold" }}>1-Year Return (%)</TableCell>
                  <TableCell sx={{ color: "#00FF7F", fontWeight: "bold" }}>Action</TableCell>
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
                    <TableCell sx={{ color: "#7CFC00" }}>{index + 1}</TableCell>
                    <TableCell sx={{ color: "#7CFC00" }}>{fund.schemeName}</TableCell>
                    <TableCell sx={{ color: "#7CFC00" }}>{fund.fundHouse || "N/A"}</TableCell>
                    <TableCell sx={{ color: "#7CFC00" }}>{fund.category || "N/A"}</TableCell>
                    <TableCell sx={{ color: "#7CFC00" }}>
                      {fund.lastYearReturn?.toFixed(2) || "—"}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: "#00FF7F",
                          color: "#000",
                          textTransform: "none",
                          fontWeight: "bold",
                          "&:hover": { backgroundColor: "#32CD32" },
                        }}
                        onClick={() => router.push(`/funds/${fund.schemeCode}`)}
                      >
                        Explore Fund
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>
    </Box>
  );
}
