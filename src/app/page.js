"use client";

import { Container, Typography, Grid, Button, Box, Card, Stack } from "@mui/material";
import { useRouter } from "next/navigation";
import BarChartIcon from "@mui/icons-material/BarChart";
import LockIcon from "@mui/icons-material/Lock";
import SpeedIcon from "@mui/icons-material/Speed";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import MarketMarquee from "@/components/MarketMarquee";

export default function Home() {
  const router = useRouter();

  const features = [
    {
      title: "Real-time Metrics",
      desc: "Get instantaneous updates on NAVs and market movements directly from verified sources.",
      icon: <BarChartIcon sx={{ fontSize: 32, color: "#00FF7F" }} />,
    },
    {
      title: "Secure Insights",
      desc: "Bank-grade data security ensuring your investment research stays private and safe.",
      icon: <LockIcon sx={{ fontSize: 32, color: "#00FF7F" }} />,
    },
    {
      title: "Rapid Analysis",
      desc: "High-performance engines allowing you to compare thousands of funds in milliseconds.",
      icon: <SpeedIcon sx={{ fontSize: 32, color: "#00FF7F" }} />,
    },
    {
      title: "Modern Interface",
      desc: "An intuitive, glassmorphic UI designed for the next generation of savvy investors.",
      icon: <DesignServicesIcon sx={{ fontSize: 32, color: "#00FF7F" }} />,
    },
  ];

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
          opacity: 0.2,
          backgroundImage: `linear-gradient(#00FF7F 1px, transparent 1px), linear-gradient(90deg, #00FF7F 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
          maskImage: "radial-gradient(ellipse at center, black, transparent 80%)",
        }}
      />

      <MarketMarquee />

      {/* ===== Hero Section ===== */}
      <Container maxWidth="lg" sx={{ pt: { xs: 8, md: 12 }, pb: { xs: 8, md: 10 }, position: "relative" }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={7}>
            <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
              <Typography 
                variant="overline" 
                sx={{ 
                  color: "#00FF7F", 
                  fontWeight: "bold", 
                  letterSpacing: 3,
                  mb: 2,
                  display: "block"
                }}
              >
                SMARTER INVESTING STARTS HERE
              </Typography>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: "2.8rem", sm: "3.5rem", md: "4.5rem" },
                  fontWeight: 900,
                  lineHeight: 1.1,
                  mb: 3,
                  background: "linear-gradient(135deg, #fff 0%, #00FF7F 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Unlock Your <br />
                Financial Potential
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: "rgba(255,255,255,0.7)",
                  mb: 5,
                  maxWidth: "600px",
                  lineHeight: 1.6,
                }}
              >
                Comprehensive analysis, real-time data, and intelligent insights for 
                thousands of mutual funds. Make data-driven decisions with confidence.
              </Typography>

              <Stack 
                direction={{ xs: "column", sm: "row" }} 
                spacing={2} 
                sx={{ justifyContent: { xs: "center", md: "start" } }}
              >
                <Button
                  variant="contained"
                  onClick={() => router.push("/funds")}
                  sx={{
                    backgroundColor: "#00FF7F",
                    color: "#000",
                    px: 4,
                    py: 1.8,
                    borderRadius: "12px",
                    fontWeight: "bold",
                    fontSize: "1.05rem",
                    textTransform: "none",
                    boxShadow: "0 0 30px rgba(0, 255, 127, 0.4)",
                    "&:hover": {
                      backgroundColor: "#00e672",
                      transform: "translateY(-3px)",
                      boxShadow: "0 0 50px rgba(0, 255, 127, 0.6)",
                    },
                    transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                  }}
                >
                  Explore Top Funds
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => router.push("/calculator")}
                  sx={{
                    borderColor: "rgba(255, 255, 255, 0.3)",
                    color: "#fff",
                    px: 4,
                    py: 1.8,
                    borderRadius: "12px",
                    fontWeight: "bold",
                    fontSize: "1.05rem",
                    textTransform: "none",
                    "&:hover": {
                      borderColor: "#00FF7F",
                      backgroundColor: "rgba(0, 255, 127, 0.05)",
                      color: "#00FF7F",
                    },
                    transition: "all 0.3s ease"
                  }}
                >
                  Wealth Calculator
                </Button>
              </Stack>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={5} sx={{ display: { xs: "none", md: "flex" }, justifyContent: "center" }}>
            <Box 
              sx={{ 
                position: "relative",
                p: 4,
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: "10%",
                  left: "10%",
                  width: "100%",
                  height: "100%",
                  background: "radial-gradient(circle, rgba(0, 255, 127, 0.1) 0%, transparent 70%)",
                  zIndex: -1,
                }
              }}
            >
              <Card 
                className="glass-card" 
                sx={{ 
                  p: 4, 
                  width: "320px",
                  p: 3,
                  background: "rgba(255, 255, 255, 0.03) !important",
                  border: "1px solid rgba(0, 255, 127, 0.2)",
                  transform: "rotate(5deg)",
                  transition: "all 0.3s ease",
                  "&:hover": { transform: "rotate(0deg) scale(1.05)", background: "rgba(0, 255, 127, 0.08) !important" }
                }}
              >
                <Stack spacing={2}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.5)" }}>Top Performer</Typography>
                    <TrendingUpIcon sx={{ color: "#00FF7F" }} />
                  </Box>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: "#fff" }}>Equity Advantage Fund</Typography>
                  <Box>
                    <Typography variant="h4" sx={{ color: "#00FF7F", fontWeight: 900 }}>+24.8%</Typography>
                    <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.4)" }}>Annualized Returns (3Y)</Typography>
                  </Box>
                  <Box sx={{ height: "4px", width: "100%", bgcolor: "rgba(255,255,255,0.1)", borderRadius: 1 }}>
                    <Box sx={{ height: "100%", width: "70%", bgcolor: "#00FF7F", borderRadius: 1 }} />
                  </Box>
                </Stack>
              </Card>

              <Card 
                className="glass-card" 
                sx={{ 
                  p: 3, 
                  width: "280px",
                  position: "absolute",
                  bottom: "-40px",
                  left: "-60px",
                  background: "rgba(255, 255, 255, 0.03) !important",
                  border: "1px solid rgba(0, 209, 255, 0.2)",
                  transform: "rotate(-8deg)",
                  transition: "all 0.3s ease",
                  "&:hover": { transform: "rotate(0deg) scale(1.05)", background: "rgba(0, 209, 255, 0.08) !important" }
                }}
              >
                <Stack spacing={1}>
                  <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
                    <Box sx={{ p: 1, bgcolor: "rgba(0, 209, 255, 0.1)", borderRadius: 2 }}>
                      <AccountBalanceWalletIcon sx={{ color: "#00D1FF", fontSize: 20 }} />
                    </Box>
                    <Typography variant="subtitle2" sx={{ color: "#fff" }}>Watchlist Growth</Typography>
                  </Box>
                  <Typography variant="h5" fontWeight="bold" sx={{ color: "#fff" }}>₹12,45,000</Typography>
                </Stack>
              </Card>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* ===== Metrics Bar ===== */}
      <Box sx={{ py: 6, borderY: "1px solid rgba(255,255,255,0.05)", bgcolor: "rgba(255,255,255,0.02)" }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent="center" textAlign="center">
            {[
              { val: "2,500+", label: "Mutual Funds" },
              { val: "40+", label: "Fund Houses" },
              { val: "1M+", label: "Active Users" },
              { val: "₹500B+", label: "AUM Analyzed" },
            ].map((stat, idx) => (
              <Grid item xs={6} md={3} key={idx}>
                <Typography variant="h4" fontWeight="900" sx={{ color: "#00FF7F" }}>{stat.val}</Typography>
                <Typography variant="body2" color="rgba(255,255,255,0.5)" sx={{ letterSpacing: 1 }}>{stat.label}</Typography>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ===== Trending Section ===== */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
          <Box>
            <Typography variant="h4" fontWeight="bold" sx={{ color: "#fff" }}>Trending Schemes</Typography>
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.5)" }}>Top performing categories and funds right now</Typography>
          </Box>
          <Button 
            onClick={() => router.push("/funds")}
            sx={{ color: "#00FF7F", textTransform: "none", fontWeight: "bold" }}
          >
            View all funds →
          </Button>
        </Stack>
        <Grid container spacing={3}>
          {[
            { name: "SBI Bluechip Fund", cat: "Equity: Large Cap", risk: "Very High", return: "+18.4%" },
            { name: "HDFC Mid-Cap Opportunities", cat: "Equity: Mid Cap", risk: "Very High", return: "+26.1%" },
            { name: "ICICI Prudential Bluechip", cat: "Equity: Large Cap", risk: "Very High", return: "+21.2%" },
          ].map((fund, idx) => (
            <Grid item xs={12} md={4} key={idx}>
              <Card 
                className="glass-card" 
                sx={{ 
                  p: 3, 
                  cursor: "pointer",
                  background: "rgba(255, 255, 255, 0.03) !important", // Force glass background
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  "&:hover": { transform: "translateY(-10px)", border: "1px solid #00FF7F" }
                }}
                onClick={() => router.push("/active-funds")}
              >
                <Typography variant="caption" sx={{ color: "#00FF7F", bgcolor: "rgba(0,255,127,0.1)", px: 1, py: 0.5, borderRadius: 1 }}>
                  {fund.cat}
                </Typography>
                <Typography variant="h6" sx={{ mt: 1.5, mb: 1, fontWeight: "bold", color: "#fff" }}>{fund.name}</Typography>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>Risk Profile</Typography>
                    <Typography variant="body2" sx={{ fontWeight: "bold", color: "#fff" }}>{fund.risk}</Typography>
                  </Box>
                  <Box sx={{ textAlign: "right" }}>
                    <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>1Y Return</Typography>
                    <Typography variant="body1" sx={{ fontWeight: "900", color: "#00FF7F" }}>{fund.return}</Typography>
                  </Box>
                </Stack>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* ===== Features Section ===== */}
      <Container maxWidth="lg" sx={{ py: 12 }}>
        <Box sx={{ mb: 10, textAlign: "center" }}>
          <Typography variant="h3" fontWeight="bold" gutterBottom sx={{ color: "#fff" }}>Why Choose US?</Typography>
          <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.6)", maxWidth: 600, mx: "auto" }}>
            Powering your investment journey with cutting-edge tools and real-time intelligence.
          </Typography>
        </Box>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr 1fr" },
            gap: 4,
            width: "100%",
          }}
        >
          {features.map((item, index) => (
            <Card
              key={index}
              className="glass-card"
              sx={{
                p: { xs: 4, md: 5 },
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                gap: 2.5,
                background: "rgba(255, 255, 255, 0.03) !important",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                transition: "all 0.3s ease",
                "&:hover": {
                  background: "rgba(0, 255, 127, 0.08) !important",
                  borderColor: "#00FF7F",
                  transform: "translateY(-10px)",
                }
              }}
            >
              <Box 
                sx={{ 
                  p: 2, 
                  borderRadius: "20px", 
                  bgcolor: "rgba(0, 255, 127, 0.05)",
                  border: "1px solid rgba(0, 255, 127, 0.2)",
                  mb: 1
                }}
              >
                {item.icon}
              </Box>
              <Typography variant="h6" fontWeight="bold" sx={{ color: "#fff" }}>{item.title}</Typography>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.7, fontSize: "0.95rem" }}>
                {item.desc}
              </Typography>
            </Card>
          ))}
        </Box>
      </Container>
      
      {/* ===== CTA Section ===== */}
      <Container maxWidth="md" sx={{ mb: 12 }}>
        <Box 
          sx={{ 
            p: { xs: 4, md: 8 }, 
            borderRadius: "32px", 
            background: "linear-gradient(135deg, rgba(0, 255, 127, 0.1) 0%, rgba(0, 209, 255, 0.1) 100%)",
            border: "1px solid rgba(255,255,255,0.1)",
            textAlign: "center",
            position: "relative",
            overflow: "hidden"
          }}
        >
          <Typography variant="h4" fontWeight="bold" mb={2}>Ready to start your journey?</Typography>
          <Typography variant="body1" color="rgba(255,255,255,0.6)" mb={4}>
            Join thousands of investors who use our platform to maximize their returns.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => router.push("/funds")}
            sx={{
              backgroundColor: "#fff",
              color: "#000",
              fontWeight: "bold",
              px: 6,
              borderRadius: "12px",
              "&:hover": { backgroundColor: "#eee" }
            }}
          >
            Get Started Now
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
