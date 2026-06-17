'use client';

import { useEffect, useState, useMemo, useCallback } from "react";
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
        const res = await fetch(`/api/funds/${code}`);
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

  const getReturns = useCallback((years) => {
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
  }, [fund]);

  const returns1Y = useMemo(() => getReturns(1), [fund, getReturns]);
  const returns3Y = useMemo(() => getReturns(3), [fund, getReturns]);
  const returns5Y = useMemo(() => getReturns(5), [fund, getReturns]);

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
      <Container maxWidth="lg" sx={{ pt: { xs: 4, sm: 6 }, pb: 8, px: { xs: 2.5, sm: 4 }, position: "relative", zIndex: 1 }}>
        {/* Breadcrumbs/Back */}
        <Box sx={{ mb: 4, maxWidth: "800px", mx: "auto" }}>
          <Button
            onClick={() => router.back()}
            sx={{
              color: "rgba(255,255,255,0.4)",
              textTransform: "none",
              fontSize: "0.9rem",
              "&:hover": { color: "#00FF7F", bgcolor: "transparent" },
              pl: 0
            }}
            startIcon={<ArrowBackIcon sx={{ fontSize: 18 }} />}
          >
            Insights Center / Fund Analysis
          </Button>
        </Box>

        {/* HEADER SECTION */}
        <Box sx={{ mb: 6, maxWidth: "800px", mx: "auto" }}>
          <Typography
            variant="h3"
            sx={{ 
              fontWeight: 900,
              mb: 2, 
              color: "#fff",
              fontSize: { xs: "1.8rem", sm: "2.8rem" },
              lineHeight: 1.2
            }}
          >
            {metadata.scheme_name}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            <Box className="glass-card" sx={{ px: 2, py: 0.8, borderRadius: 2, bgcolor: "rgba(0, 255, 127, 0.05)", border: "1px solid rgba(0, 255, 127, 0.1)" }}>
              <Typography variant="caption" sx={{ color: "#00FF7F", fontWeight: 800, letterSpacing: 1 }}>
                {metadata.scheme_category?.toUpperCase()}
              </Typography>
            </Box>
            <Box className="glass-card" sx={{ px: 2, py: 0.8, borderRadius: 2, bgcolor: "rgba(0, 209, 255, 0.05)", border: "1px solid rgba(0, 209, 255, 0.1)" }}>
              <Typography variant="caption" sx={{ color: "#00D1FF", fontWeight: 800, letterSpacing: 1 }}>
                {metadata.fund_house?.toUpperCase()}
              </Typography>
            </Box>
          </Box>
        </Box>

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
          {/* REAL-TIME VALUE CARD */}
          <Box 
            className="glass-card" 
            sx={{ 
              p: 4, 
              width: "100%", 
              bgcolor: "rgba(0, 255, 127, 0.05)", 
              border: "1px solid rgba(0, 255, 127, 0.2)",
              boxSizing: 'border-box'
            }}
          >
            <Typography variant="body2" sx={{ color: "#00FF7F", fontWeight: 800, letterSpacing: 2, mb: 2 }}>CURRENT NAV</Typography>
            <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 900, color: "#fff" }}>₹ {latest?.nav}</Typography>
            </Box>
            <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.4)" }}>Terminal Data: {latest?.date}</Typography>
            
            <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
              {[
                { label: "1-Year Projection", val: returns1Y },
                { label: "3-Year Projection", val: returns3Y },
                { label: "5-Year Projection", val: returns5Y },
              ].map(stat => stat.val !== "N/A" && (
                <Box key={stat.label} sx={{ display: 'flex', justifyContent: 'space-between', p: 1.5, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 2 }}>
                  <Typography variant="body2" color="rgba(255,255,255,0.5)">{stat.label}</Typography>
                  <Typography variant="body2" sx={{ color: "#00FF7F", fontWeight: 800 }}>+{stat.val}%</Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {/* NAV TRAJECTORY */}
          <Box className="glass-card" sx={{ p: { xs: 2, sm: 4 }, width: "100%", boxSizing: 'border-box' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: "#fff" }}>NAV Trajectory</Typography>
                <Typography variant="caption" color="rgba(255,255,255,0.4)">Performance over selected timeline</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', p: 0.5, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 2 }}>
                {["1Y", "3Y", "5Y", "ALL"].map(d => (
                  <Button
                    key={d}
                    onClick={() => setChartDuration(d)}
                    sx={{
                      px: 2,
                      minWidth: 50,
                      height: 32,
                      fontSize: "0.75rem",
                      fontWeight: 800,
                      borderRadius: 1.5,
                      color: chartDuration === d ? "#000" : "rgba(255,255,255,0.5)",
                      bgcolor: chartDuration === d ? "#00FF7F" : "transparent",
                      "&:hover": { bgcolor: chartDuration === d ? "#00FF7F" : "rgba(255,255,255,0.05)" },
                      transition: "all 0.3s ease"
                    }}
                  >
                    {d}
                  </Button>
                ))}
              </Box>
            </Box>

            <Box sx={{ height: 400, width: "100%", ml: -2 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="navGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00FF7F" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#00FF7F" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }}
                    minTickGap={60}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }}
                    dx={-10}
                    domain={['auto', 'auto']}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#0e0e0e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: 12 }}
                    itemStyle={{ color: "#00FF7F", fontWeight: 800 }}
                    labelStyle={{ color: "rgba(255,255,255,0.4)", marginBottom: 4 }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="nav" 
                    stroke="#00FF7F" 
                    strokeWidth={3} 
                    fill="url(#navGradient)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Box>

          {/* SCHEME INFRASTRUCTURE */}
          <Box sx={{ width: "100%" }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>Scheme Infrastructure</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: "100%" }}>
              {[
                { label: "Fund House", value: metadata.fund_house },
                { label: "Type", value: metadata.scheme_type },
                { label: "Category", value: metadata.scheme_category },
                { label: "ISIN (Growth)", value: metadata.isin_growth },
              ].map((item, idx) => (
                <Box key={idx} className="glass-card" sx={{ p: 3, border: "1px solid rgba(255,255,255,0.03)", width: "100%", boxSizing: 'border-box' }}>
                  <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.4)", fontWeight: 700, letterSpacing: 1 }}>{item.label?.toUpperCase()}</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 700, color: "#fff", mt: 0.5 }}>{item.value || "Not Disclosed"}</Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {/* INTERACTIVE SIP CALCULATOR */}
          <Box className="glass-card" sx={{ p: 4, width: "100%", boxSizing: 'border-box' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>Portfolio Forecast (SIP)</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField 
                label="Monthly Commitment" 
                fullWidth 
                value={sipAmount} 
                onChange={(e) => setSipAmount(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': { color: '#fff', borderRadius: 3, bgcolor: 'rgba(255,255,255,0.02)' },
                  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.4)' }
                }}
                InputProps={{ startAdornment: <InputAdornment position="start"><Typography color="#00FF7F">₹</Typography></InputAdornment> }}
              />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField label="Years" fullWidth value={sipYears} onChange={(e) => setSipYears(e.target.value)}
                    sx={{ '& .MuiOutlinedInput-root': { color: '#fff', borderRadius: 3 } }} />
                </Grid>
                <Grid item xs={6}>
                  <TextField label="Return %" fullWidth value={sipRate} onChange={(e) => setSipRate(e.target.value)}
                    sx={{ '& .MuiOutlinedInput-root': { color: '#fff', borderRadius: 3 } }} />
                </Grid>
              </Grid>
              <Box sx={{ p: 3, bgcolor: '#00FF7F', borderRadius: 3, textAlign: 'center', boxShadow: '0 10px 30px rgba(0, 255, 127, 0.2)' }}>
                <Typography variant="caption" sx={{ color: '#000', fontWeight: 800, opacity: 0.6 }}>PROJECTED MATURITY</Typography>
                <Typography variant="h5" sx={{ color: '#000', fontWeight: 900 }}>₹{Number(calculateSIP()).toLocaleString('en-IN')}</Typography>
              </Box>
            </Box>
          </Box>

          {/* LUMPSUM CALCULATOR */}
          <Box className="glass-card" sx={{ p: 4, width: "100%", boxSizing: 'border-box' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>Lumpsum Growth</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField label="Initial Capital" fullWidth value={lumpAmount} onChange={(e) => setLumpAmount(e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { color: '#fff', borderRadius: 3 } }}
                InputProps={{ startAdornment: <InputAdornment position="start"><Typography color="#00FF7F">₹</Typography></InputAdornment> }}
              />
              <Box sx={{ p: 2.5, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 3, textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 700 }}>PROJECTED VALUE</Typography>
                <Typography variant="h5" sx={{ color: '#fff', fontWeight: 900 }}>₹{Number(calculateLumpsum()).toLocaleString('en-IN')}</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
