"use client";

import { Container, Typography, Grid, Button, Box, Card } from "@mui/material";
import { useRouter } from "next/navigation";
import BarChartIcon from "@mui/icons-material/BarChart";
import LockIcon from "@mui/icons-material/Lock";
import SpeedIcon from "@mui/icons-material/Speed";
import DesignServicesIcon from "@mui/icons-material/DesignServices";

export default function Home() {
  const router = useRouter();

  const features = [
    {
      title: "Accurate & Updated Data",
      desc: "Get real-time information directly from reliable APIs with up-to-date NAVs and fund details.",
      icon: <BarChartIcon sx={{ fontSize: 40, color: "#00FF7F" }} />,
    },
    {
      title: "Fast & Secure",
      desc: "Optimized for speed and secure browsing for safe investment decisions.",
      icon: <LockIcon sx={{ fontSize: 40, color: "#00FF7F" }} />,
    },
    {
      title: "Smart Analysis Tools",
      desc: "Compare performance, categories, and returns across thousands of funds.",
      icon: <SpeedIcon sx={{ fontSize: 40, color: "#00FF7F" }} />,
    },
    {
      title: "Beautiful Interface",
      desc: "Experience a clean, responsive, and modern UI that makes investing enjoyable.",
      icon: <DesignServicesIcon sx={{ fontSize: 40, color: "#00FF7F" }} />,
    },
  ];

  return (
    <Box
      sx={{
        backgroundColor: "#000",
        color: "#00FF7F",
        display: "flex",
        flexDirection: "column",
        flex: 1
      }}
    >
      {/* ===== Hero Section ===== */}
      <Container
        maxWidth="md"
        sx={{
          mt: { xs: 4, sm: 8, md: 10 },
          mb: { xs: 6, sm: 8, md: 10 },
          mx: { xs: "16px", sm: "auto" },
          width: { xs: "calc(100% - 32px)", sm: "auto" },
          backgroundColor: "rgba(0,0,0,0.8)",
          border: "2px solid #00FF7F",
          borderRadius: 5,
          backdropFilter: "blur(6px)",
          p: { xs: 3, sm: 6 },
          boxShadow: "0 0 20px rgba(0,255,127,0.3)",
          textAlign: "center",
          color: "#00FF7F",
        }}
      >
        <Typography
          variant="h3"
          fontWeight="bold"
          gutterBottom
          sx={{ 
            mb: 2,
            fontSize: { xs: "2rem", sm: "3rem", md: "3.75rem" }
          }}
        >
          Discover the Best Mutual Funds
        </Typography>

        <Typography
          variant="h6"
          sx={{
            color: "#90EE90",
            mb: { xs: 4, sm: 5 },
            fontSize: { xs: "1rem", sm: "1.25rem" }
          }}
        >
          Compare, analyze, and invest in top-performing mutual funds.
        </Typography>

        <Box 
          sx={{ 
            display: "flex", 
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "center", 
            gap: 2, 
            alignItems: "center"
          }}
        >
          <Button
            variant="contained"
            size="large"
            onClick={() => router.push("/funds")}
            sx={{
              width: { xs: "100%", sm: "auto" },
              borderRadius: 3,
              px: { xs: 4, sm: 6 },
              py: 2,
              fontSize: { xs: "1rem", sm: "1.2rem" },
              fontWeight: "bold",
              backgroundColor: "#00FF7F",
              color: "#000",
              textTransform: "none",
              boxShadow: "0 0 15px #00FF7F",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "#32CD32",
                color: "#fff",
                transform: "scale(1.05)",
                boxShadow: "0 0 25px #00FF7F",
              },
            }}
          >
            Explore Funds
          </Button>

          <Button
            variant="outlined"
            size="large"
            onClick={() => router.push("/calculator")}
            sx={{
              width: { xs: "100%", sm: "auto" },
              borderRadius: 3,
              px: { xs: 4, sm: 6 },
              py: 2,
              fontSize: { xs: "1rem", sm: "1.2rem" },
              fontWeight: "bold",
              border: "2px solid #00FF7F",
              color: "#00FF7F",
              textTransform: "none",
              boxShadow: "0 0 15px rgba(0,255,127,0.2)",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "#00FF7F",
                color: "#000",
                transform: "scale(1.05)",
                boxShadow: "0 0 25px #00FF7F",
              },
            }}
          >
            Calculator
          </Button>
        </Box>
      </Container>

      {/* ===== Why Choose Section ===== */}
      <Container maxWidth="lg" sx={{ mb: { xs: 6, sm: 10 }, px: { xs: 2, sm: 4 } }}>
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{
            mb: { xs: 4, sm: 6 },
            textAlign: "center",
            color: "#00FF7F",
            fontSize: { xs: "1.5rem", sm: "2.125rem" }
          }}
        >
          Why Choose Mutual Fund Explorer?
        </Typography>

        <Grid container spacing={3} justifyContent="center">
          {features.map((item, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  backgroundColor: "#111",
                  border: "1px solid rgba(0, 255, 127, 0.3)",
                  borderRadius: 4,
                  color: "#00FF7F",
                  p: { xs: 2.5, sm: 3 },
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    borderColor: "#00FF7F",
                    boxShadow: "0 0 25px rgba(0,255,127,0.3)",
                  },
                }}
              >
                {item.icon}
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  sx={{
                    mt: 2,
                    mb: 1,
                    color: "#00FF7F",
                    textAlign: "center",
                    fontSize: { xs: "1rem", sm: "1.25rem" }
                  }}
                >
                  {item.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#90EE90",
                    textAlign: "center",
                    fontSize: { xs: "0.85rem", sm: "0.875rem" }
                  }}
                >
                  {item.desc}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
