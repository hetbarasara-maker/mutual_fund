"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Container,
  CircularProgress,
  Button,
  Grid,
  Card,
  CardContent,
  Divider,
  TextField,
} from "@mui/material";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { parse, subYears } from "date-fns";

export default function SchemePage() {
  const { code } = useParams();
  const router = useRouter();
  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [amount, setAmount] = useState(10000);
  const [years, setYears] = useState(3);
  const [finalValue, setFinalValue] = useState(null);

  // Fetch Scheme Data
  useEffect(() => {
    async function fetchScheme() {
      try {
        const res = await fetch(`/api/scheme/${code}`);
        if (!res.ok) throw new Error("Failed to fetch scheme details");
        const data = await res.json();
        setScheme(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (code) fetchScheme();
  }, [code]);

  if (loading) {
    return (
      <Box sx={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#000" }}>
        <CircularProgress sx={{ color: "#00FF7F" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ backgroundColor: "#000", color: "#FF5555", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
        <Typography variant="h6">Error: {error}</Typography>
        <Button
          onClick={() => router.push("/funds")}
          sx={{
            mt: 2,
            color: "#00FF7F",
            border: "1px solid #00FF7F",
            "&:hover": { backgroundColor: "rgba(0,255,127,0.2)" },
          }}
        >
          Go Back
        </Button>
      </Box>
    );
  }

  if (!scheme) {
    return <Typography color="#90EE90" align="center" sx={{ mt: 5 }}>No data available.</Typography>;
  }

  const { metadata, navHistory } = scheme;
  const latestNav = navHistory?.[0];
  const oldestNav = navHistory?.[navHistory.length - 1];
  const currentNav = parseFloat(latestNav?.nav || 0);
  const oldNav = parseFloat(oldestNav?.nav || 0);

  // CAGR Calculation
  const calcCAGR = (years) => {
    if (!latestNav?.date) return '0.00';

    // Find NAV from n years ago
    const currentDate = parse(latestNav.date, "dd-MM-yyyy", new Date());
    const targetDate = subYears(currentDate, years);

    // Find entry closest to target date (assuming desc sort)
    // We want the first entry whose date is <= targetDate
    const oldEntry = navHistory.find(item => {
      const d = parse(item.date, "dd-MM-yyyy", new Date());
      return d <= targetDate;
    });

    if (!oldEntry) return 'N/A';

    const currentVal = parseFloat(latestNav.nav);
    const oldVal = parseFloat(oldEntry.nav);

    if (oldVal === 0) return '0.00';

    const cagr = (Math.pow(currentVal / oldVal, 1 / years) - 1) * 100;
    return cagr.toFixed(2);
  };

  const cagr1y = calcCAGR(1);
  const cagr3y = calcCAGR(3);
  const cagr5y = calcCAGR(5);

  // User Calculator
  const handleCalculate = () => {
    const rate = cagr3y / 100;
    const val = amount * Math.pow(1 + rate, years);
    setFinalValue(val.toFixed(2));
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#000", color: "#00FF7F" }}>
      {/* ===== Fund Info ===== */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box 
          sx={{ 
            display: "flex", 
            flexDirection: "column", 
            gap: 4, 
            maxWidth: "800px", 
            mx: "auto", 
            width: "100%" 
          }}
        >
          <Typography variant="h4" align="center" fontWeight="bold" sx={{ mb: 2 }}>
            {metadata.scheme_name}
          </Typography>

          {/* Returns Overview Card */}
          <Card sx={{ backgroundColor: "#111", border: "1px solid #00FF7F", width: "100%" }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: "#90EE90", mb: 2 }}>Returns Overview</Typography>
              <Divider sx={{ borderColor: "#00FF7F", mb: 2 }} />
              <Typography><strong>Latest NAV:</strong> ₹{currentNav}</Typography>
              <Typography><strong>1 Year Return:</strong> {cagr1y}%</Typography>
              <Typography><strong>3 Year Return:</strong> {cagr3y}%</Typography>
              <Typography><strong>5 Year Return:</strong> {cagr5y}%</Typography>
            </CardContent>
          </Card>

          {/* Fund Details Card */}
          <Card sx={{ backgroundColor: "#111", border: "1px solid #00FF7F", boxShadow: "0 0 15px rgba(0,255,127,0.2)", width: "100%" }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: "#90EE90", mb: 2 }}>
                Fund Details
              </Typography>
              <Divider sx={{ borderColor: "#00FF7F", mb: 2 }} />
              <Typography><strong>Fund House:</strong> {metadata.fund_house}</Typography>
              <Typography><strong>Category:</strong> {metadata.scheme_category}</Typography>
              <Typography><strong>Type:</strong> {metadata.scheme_type}</Typography>
              <Typography><strong>ISIN Div Payout:</strong> {metadata.isin_div_payout}</Typography>
              <Typography><strong>ISIN Reinvestment:</strong> {metadata.isin_div_reinvestment}</Typography>
            </CardContent>
          </Card>

          {/* ===== NAV Chart ===== */}
          <Box sx={{ p: 3, borderRadius: 4, backgroundColor: "#111", border: "1px solid #00FF7F", width: "100%" }}>
            <Typography variant="h6" sx={{ color: "#90EE90", mb: 2 }}>NAV History</Typography>
            <ResponsiveContainer width="100%" height="300">
              <LineChart data={navHistory.slice(0, 60).reverse()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="date" tick={{ fill: "#00FF7F", fontSize: 10 }} />
                <YAxis tick={{ fill: "#00FF7F" }} />
                <Tooltip contentStyle={{ backgroundColor: "#111", border: "1px solid #00FF7F", color: "#00FF7F" }} />
                <Line type="monotone" dataKey="nav" stroke="#00FF7F" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </Box>

          {/* ===== Calculator ===== */}
          <Box sx={{ p: 3, borderRadius: 4, backgroundColor: "#111", border: "1px solid #00FF7F", width: "100%" }}>
            <Typography variant="h6" sx={{ color: "#90EE90", mb: 2 }}>Return Calculator</Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Investment Amount (₹)"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  InputLabelProps={{ style: { color: "#00FF7F" } }}
                  InputProps={{ style: { color: "#00FF7F" } }}
                  sx={{ "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: "#00FF7F" } } }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Years"
                  type="number"
                  value={years}
                  onChange={(e) => setYears(e.target.value)}
                  InputLabelProps={{ style: { color: "#00FF7F" } }}
                  InputProps={{ style: { color: "#00FF7F" } }}
                  sx={{ "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: "#00FF7F" } } }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Button
                  variant="contained"
                  onClick={handleCalculate}
                  sx={{
                    backgroundColor: "#00FF7F",
                    color: "#000",
                    px: 4,
                    py: 1.5,
                    borderRadius: 3,
                    fontWeight: "bold",
                    "&:hover": { backgroundColor: "#32CD32" },
                  }}
                >
                  Calculate
                </Button>
              </Grid>
            </Grid>

            {finalValue && (
              <Typography sx={{ mt: 3, color: "#90EE90" }}>
                💰 Your investment of ₹{amount} could grow to approximately <strong>₹{finalValue}</strong> in {years} years.
              </Typography>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
    </Box>
  );
}
