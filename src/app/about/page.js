"use client";

import { Box, Typography, Container, Button, Grid } from "@mui/material";
import { useRouter } from "next/navigation";

export default function AboutPage() {
  const router = useRouter();

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
      <Container maxWidth="md" sx={{ flex: 1, py: { xs: 8, sm: 12 }, px: { xs: 3, sm: 4 }, position: "relative", zIndex: 1 }}>
        <Box sx={{ mb: 10, textAlign: "center" }}>
          <Typography
            variant="h1"
            sx={{ 
              fontWeight: 900,
              mb: 2, 
              background: "linear-gradient(135deg, #fff 0%, #00FF7F 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontSize: { xs: "2.8rem", sm: "4.5rem" },
              letterSpacing: -2
            }}
          >
            Our Vision
          </Typography>
          <Typography variant="h5" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 300, maxWidth: 700, mx: "auto", lineHeight: 1.6 }}>
            Redefining wealth intelligence through precision data and 
            sophisticated technology.
          </Typography>
        </Box>

        <Box className="glass-card" sx={{ p: { xs: 4, sm: 8 }, bgcolor: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <Typography
            variant="h4"
            sx={{ 
              mb: 4, 
              color: "#fff", 
              fontWeight: 800,
              fontSize: { xs: "1.8rem", sm: "2.2rem" }
            }}
          >
            Empowering the Modern Investor
          </Typography>
          
          <Typography
            variant="body1"
            sx={{ 
              mb: 6, 
              color: "rgba(255,255,255,0.6)", 
              lineHeight: 1.9,
              fontSize: "1.15rem"
            }}
          >
            Mutual Fund Explorer is more than just a tracking tool. It is a high-performance 
            analytics platform designed to bridge the gap between complex market data and 
            actionable investment strategies. Our systems monitor thousands of schemes 
            in real-time to provide the clarity you need to scale your wealth.
          </Typography>

          <Grid container spacing={4} sx={{ mb: 6 }}>
            {[
              { title: "Precision", desc: "Data accuracy is our core priority. Every metric is verified and updated continuously." },
              { title: "Clarity", desc: "Complex financial instruments decoded into intuitive visual insights and simple rankings." },
            ].map((feature, i) => (
              <Grid item xs={12} sm={6} key={feature.title}>
                <Box sx={{ p: 3, borderRadius: 3, bgcolor: "rgba(0, 255, 127, 0.03)", border: "1px solid rgba(0, 255, 127, 0.1)" }}>
                  <Typography variant="h6" sx={{ color: "#00FF7F", fontWeight: 900, mb: 1 }}>{feature.title}</Typography>
                  <Typography variant="body2" color="rgba(255,255,255,0.5)">{feature.desc}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>

          <Button 
            variant="contained" 
            fullWidth={false}
            onClick={() => router.push("/funds")}
            sx={{ 
              backgroundColor: "#00FF7F", 
              color: "#000", 
              fontWeight: 900,
              borderRadius: 3,
              px: 6,
              py: 2,
              textTransform: "none",
              fontSize: "1.1rem",
              boxShadow: "0 0 25px rgba(0, 255, 127, 0.2)",
              "&:hover": { backgroundColor: "#00e672", transform: 'translateY(-2px)' }
            }}
          >
            Initialize Platform
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
