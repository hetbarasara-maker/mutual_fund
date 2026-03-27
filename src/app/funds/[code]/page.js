'use client';

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Container,
  CircularProgress,
  Button,
  Grid,
  Divider,
  TextField,
  Chip,
  Paper,
  InputAdornment,
  ButtonGroup
} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CategoryIcon from '@mui/icons-material/Category';
import BusinessIcon from '@mui/icons-material/Business';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { parse, subYears, isAfter, format } from "date-fns";

export default function FundDetailsPage() {
  const { code } = useParams();
  const router = useRouter();
  const [fund, setFund] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartDuration, setChartDuration] = useState("1Y"); // 1Y, 3Y, 5Y, ALL

  // Calculators state
  const [sipAmount, setSipAmount] = useState(1000);
  const [sipYears, setSipYears] = useState(3);
  const [sipRate, setSipRate] = useState(12);
  const [lumpAmount, setLumpAmount] = useState(10000);
  const [lumpYears, setLumpYears] = useState(3);
  const [lumpRate, setLumpRate] = useState(12);

  useEffect(() => {
    async function fetchFund() {
      try {
        const res = await fetch(`/api/scheme/${code}`);
        if (!res.ok) throw new Error("Failed to fetch fund details");
        const data = await res.json();
        setFund(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (code) fetchFund();
  }, [code]);

  const calculateSIP = () => {
    const P = parseFloat(sipAmount) || 0;
    const n = (parseFloat(sipYears) || 0) * 12;
    const i = (parseFloat(sipRate) || 0) / 12 / 100;

    if (P === 0 || n === 0 || i === 0) return "0.00";

    const futureValue = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
    return futureValue.toFixed(2);
  };

  const calculateLumpsum = () => {
    const P = parseFloat(lumpAmount) || 0;
    const t = parseFloat(lumpYears) || 0;
    const r = parseFloat(lumpRate) || 0;

    if (P === 0 || t === 0) return "0.00";

    const futureValue = P * Math.pow(1 + r / 100, t);
    return futureValue.toFixed(2);
  };

  const getReturns = (years) => {
    if (!fund?.navHistory || fund.navHistory.length < 2) return "N/A";

    const latest = fund.navHistory[0];
    const latestDate = parse(latest.date, "dd-MM-yyyy", new Date());
    const targetDate = subYears(latestDate, years);

    // Find the closest NAV to targetDate
    // method: find last entry where date >= targetDate (since sorted desc)
    // Actually, sorted desc means [0] is newest.
    // Iterating finding the *first* entry that is <= targetDate? 
    // No. We want the NAV *at* targetDate.
    // Since sorted desc: 2024, 2023...
    // We want entry close to (Latest - Years).
    // Let's find entry closest to targetDate.

    const entry = fund.navHistory.find(item => {
      const d = parse(item.date, "dd-MM-yyyy", new Date());
      return d <= targetDate;
    });

    if (!entry) return "N/A"; // Not enough history

    const latestNav = parseFloat(latest.nav);
    const oldNav = parseFloat(entry.nav);

    if (isNaN(latestNav) || isNaN(oldNav) || oldNav === 0) return "N/A";

    // For annualized return (CAGR)
    // Formula: (Latest/Old)^(1/n) - 1
    // If exactly 'years', use years.
    const cagr = (Math.pow(latestNav / oldNav, 1 / years) - 1) * 100;

    return cagr.toFixed(2);
  };

  const returns1Y = useMemo(() => getReturns(1), [fund]);
  const returns3Y = useMemo(() => getReturns(3), [fund]);
  const returns5Y = useMemo(() => getReturns(5), [fund]);

  const chartData = useMemo(() => {
    if (!fund?.navHistory) return [];

    let filtered = fund.navHistory;

    if (chartDuration !== "ALL") {
      const years = parseInt(chartDuration.replace("Y", ""));
      const latestDate = parse(fund.navHistory[0].date, "dd-MM-yyyy", new Date());
      const cutoffDate = subYears(latestDate, years);

      filtered = fund.navHistory.filter(item => {
        const d = parse(item.date, "dd-MM-yyyy", new Date());
        return isAfter(d, cutoffDate);
      });
    }

    return filtered.map(item => ({
      date: item.date,
      nav: parseFloat(item.nav),
      parsedDate: parse(item.date, "dd-MM-yyyy", new Date()) // for sorting if needed, but assuming API sort is good desc
    })).reverse();
  }, [fund, chartDuration]);


  if (loading)
    return (
      <Box sx={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#0a0a0a" }}>
        <CircularProgress sx={{ color: "#00FF7F" }} />
      </Box>
    );

  if (error)
    return (
      <Box sx={{ backgroundColor: "#0a0a0a", color: "#FF5555", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        <Typography variant="h6">Error: {error}</Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={() => router.back()} sx={{ mt: 2, color: "#00FF7F", borderColor: "#00FF7F" }} variant="outlined">
          Go Back
        </Button>
      </Box>
    );

  if (!fund)
    return (
      <Box sx={{ backgroundColor: "#0a0a0a", minHeight: "100vh", p: 4, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <Typography align="center" sx={{ color: "#90EE90", mb: 2 }}>
          No data found for this fund.
        </Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={() => router.back()} sx={{ color: "#00FF7F", borderColor: "#00FF7F" }} variant="outlined">
          Go Back
        </Button>
      </Box>
    );

  const { metadata, navHistory } = fund;
  const latest = navHistory?.[0];

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#0a0a0a", color: "#e0e0e0", pb: 8 }}>
      <Container maxWidth="lg" sx={{ pt: 4 }}>
        {/* HEADER */}
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.back()}
            sx={{
              color: "#00FF7F",
              border: "1px solid rgba(0, 255, 127, 0.3)",
              '&:hover': { backgroundColor: "rgba(0, 255, 127, 0.1)", border: "1px solid #00FF7F" }
            }}
          >
            Back
          </Button>
          <Box>
            <Typography variant="h4" fontWeight="bold" sx={{ color: "#fff", mb: 1 }}>
              {metadata.scheme_name}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                label={metadata.scheme_category}
                size="small"
                icon={<CategoryIcon style={{ color: '#90EE90' }} />}
                sx={{ backgroundColor: "#1a1a1a", color: "#90EE90", border: "1px solid #333", '& .MuiChip-icon': { color: '#90EE90' } }}
              />
              <Chip
                label={metadata.fund_house}
                size="small"
                icon={<BusinessIcon style={{ color: '#90EE90' }} />}
                sx={{ backgroundColor: "#1a1a1a", color: "#90EE90", border: "1px solid #333", '& .MuiChip-icon': { color: '#90EE90' } }}
              />
            </Box>
          </Box>
        </Box>

        <Grid container spacing={4}>
          {/* LEFT COLUMN: Metadata & Chart */}
          <Grid item xs={12} md={8}>
            {/* CHART SECTION */}
            <Paper elevation={0} sx={{ p: 3, backgroundColor: "#111", border: "1px solid #333", borderRadius: 2, mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                <Typography variant="h6" sx={{ color: "#00FF7F", display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TrendingUpIcon /> NAV Trend
                </Typography>
                <ButtonGroup size="small" variant="outlined" sx={{ '& .MuiButton-root': { color: '#00FF7F', borderColor: '#333' } }}>
                  {["1Y", "3Y", "5Y", "ALL"].map(d => (
                    <Button
                      key={d}
                      onClick={() => setChartDuration(d)}
                      sx={{
                        backgroundColor: chartDuration === d ? "rgba(0, 255, 127, 0.2)" : "transparent",
                        borderColor: chartDuration === d ? "#00FF7F !important" : "#333"
                      }}
                    >
                      {d}
                    </Button>
                  ))}
                </ButtonGroup>
              </Box>

              <Box sx={{ height: 350, width: "100%" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorNav" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00FF7F" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#00FF7F" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                    <XAxis
                      dataKey="date"
                      tick={{ fill: "#666", fontSize: 12 }}
                      tickLine={false}
                      minTickGap={40}
                    />
                    <YAxis
                      tick={{ fill: "#666", fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                      domain={['auto', 'auto']}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#000", border: "1px solid #333", color: "#fff" }}
                      itemStyle={{ color: "#00FF7F" }}
                      labelStyle={{ color: "#888", marginBottom: '0.5rem' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="nav"
                      stroke="#00FF7F"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorNav)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </Paper>

            {/* FUND INFO */}
            <Typography variant="h6" sx={{ color: "#fff", mb: 2 }}>Fund Details</Typography>
            <Grid container spacing={2}>
              {[
                { label: "Fund House", value: metadata.fund_house },
                { label: "Scheme Type", value: metadata.scheme_type },
                { label: "Category", value: metadata.scheme_category },
                { label: "Payout ISIN", value: metadata.isin_div_payout },
                { label: "Reinvestment ISIN", value: metadata.isin_div_reinvestment },
              ].map((item, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Paper sx={{ p: 2, backgroundColor: "#111", border: "1px solid #222" }}>
                    <Typography variant="caption" sx={{ color: "#888", display: 'block', mb: 0.5 }}>
                      {item.label}
                    </Typography>
                    <Typography variant="body1" sx={{ color: "#e0e0e0" }}>
                      {item.value || "N/A"}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* RIGHT COLUMN: Current Stats & Calculators */}
          <Grid item xs={12} md={4}>
            {/* LATEST NAV CARD */}
            <Paper elevation={0} sx={{ p: 3, backgroundColor: "rgba(0, 255, 127, 0.05)", border: "1px solid #00FF7F", borderRadius: 2, mb: 4 }}>
              <Typography variant="subtitle2" sx={{ color: "#00FF7F", mb: 1, textTransform: 'uppercase', letterSpacing: 1 }}>Current NAV</Typography>
              <Typography variant="h3" fontWeight="bold" sx={{ color: "#fff", mb: 1 }}>
                ₹{latest?.nav}
              </Typography>
              <Typography variant="caption" sx={{ color: "#888" }}>
                As of {latest?.date}
              </Typography>
              <Divider sx={{ my: 2, borderColor: "rgba(0, 255, 127, 0.2)" }} />

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {[
                  { label: "1Y Return", value: returns1Y, color: parseFloat(returns1Y) >= 0 ? "#00FF7F" : "#FF5555" },
                  { label: "3Y Return", value: returns3Y, color: parseFloat(returns3Y) >= 0 ? "#00FF7F" : "#FF5555" },
                  { label: "5Y Return", value: returns5Y, color: parseFloat(returns5Y) >= 0 ? "#00FF7F" : "#FF5555" }
                ].map(stat => (
                  stat.value !== "N/A" && (
                    <Box key={stat.label} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ color: "#ccc" }}>{stat.label}</Typography>
                      <Typography variant="body2" fontWeight="bold" sx={{ color: stat.color }}>{stat.value}%</Typography>
                    </Box>
                  )
                ))}
              </Box>
            </Paper>

            {/* SIP CALCULATOR */}
            <Paper elevation={0} sx={{ p: 3, backgroundColor: "#111", border: "1px solid #333", borderRadius: 2, mb: 3 }}>
              <Typography variant="h6" sx={{ color: "#fff", mb: 3 }}>SIP Calculator</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Monthly Investment"
                    type="number"
                    variant="outlined"
                    value={sipAmount}
                    onChange={(e) => setSipAmount(e.target.value)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start" sx={{ color: '#666' }}>₹</InputAdornment>,
                      sx: { color: "#fff" }
                    }}
                    InputLabelProps={{ sx: { color: "#888" } }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: '#333' },
                        '&:hover fieldset': { borderColor: '#666' },
                        '&.Mui-focused fieldset': { borderColor: '#00FF7F' },
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Years"
                    type="number"
                    value={sipYears}
                    onChange={(e) => setSipYears(e.target.value)}
                    InputProps={{ sx: { color: "#fff" } }}
                    InputLabelProps={{ sx: { color: "#888" } }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: '#333' },
                        '&:hover fieldset': { borderColor: '#666' },
                        '&.Mui-focused fieldset': { borderColor: '#00FF7F' },
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Return %"
                    type="number"
                    value={sipRate}
                    onChange={(e) => setSipRate(e.target.value)}
                    InputProps={{ sx: { color: "#fff" } }}
                    InputLabelProps={{ sx: { color: "#888" } }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: '#333' },
                        '&:hover fieldset': { borderColor: '#666' },
                        '&.Mui-focused fieldset': { borderColor: '#00FF7F' },
                      }
                    }}
                  />
                </Grid>
              </Grid>
              <Box sx={{ mt: 3, p: 2, backgroundColor: "rgba(0,0,0,0.5)", borderRadius: 1, textAlign: 'center', border: '1px solid #222' }}>
                <Typography variant="caption" sx={{ color: "#888" }}>Future Value</Typography>
                <Typography variant="h5" sx={{ color: "#00FF7F", fontWeight: 'bold' }}>
                  ₹{calculateSIP()}
                </Typography>
              </Box>
            </Paper>

            {/* LUMPSUM CALCULATOR */}
            <Paper elevation={0} sx={{ p: 3, backgroundColor: "#111", border: "1px solid #333", borderRadius: 2 }}>
              <Typography variant="h6" sx={{ color: "#fff", mb: 3 }}>Lumpsum Calculator</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Total Investment"
                    type="number"
                    value={lumpAmount}
                    onChange={(e) => setLumpAmount(e.target.value)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start" sx={{ color: '#666' }}>₹</InputAdornment>,
                      sx: { color: "#fff" }
                    }}
                    InputLabelProps={{ sx: { color: "#888" } }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: '#333' },
                        '&:hover fieldset': { borderColor: '#666' },
                        '&.Mui-focused fieldset': { borderColor: '#00FF7F' },
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Years"
                    type="number"
                    value={lumpYears}
                    onChange={(e) => setLumpYears(e.target.value)}
                    InputProps={{ sx: { color: "#fff" } }}
                    InputLabelProps={{ sx: { color: "#888" } }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: '#333' },
                        '&:hover fieldset': { borderColor: '#666' },
                        '&.Mui-focused fieldset': { borderColor: '#00FF7F' },
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Return %"
                    type="number"
                    value={lumpRate}
                    onChange={(e) => setLumpRate(e.target.value)}
                    InputProps={{ sx: { color: "#fff" } }}
                    InputLabelProps={{ sx: { color: "#888" } }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: '#333' },
                        '&:hover fieldset': { borderColor: '#666' },
                        '&.Mui-focused fieldset': { borderColor: '#00FF7F' },
                      }
                    }}
                  />
                </Grid>
              </Grid>
              <Box sx={{ mt: 3, p: 2, backgroundColor: "rgba(0,0,0,0.5)", borderRadius: 1, textAlign: 'center', border: '1px solid #222' }}>
                <Typography variant="caption" sx={{ color: "#888" }}>Future Value</Typography>
                <Typography variant="h5" sx={{ color: "#00FF7F", fontWeight: 'bold' }}>
                  ₹{calculateLumpsum()}
                </Typography>
              </Box>
            </Paper>

          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
