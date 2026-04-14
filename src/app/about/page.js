"use client";

import { Box, Typography, Container, Button } from "@mui/material";
import { useRouter } from "next/navigation";

export default function AboutPage() {
  const router = useRouter();

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
      <Container maxWidth="md" sx={{ flex: 1, py: { xs: 4, sm: 8 }, px: { xs: 3, sm: 4 } }}>
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
          About Mutual Fund Explorer
        </Typography>

        <Typography
          variant="h6"
          sx={{ 
            mb: 4, 
            color: "#90EE90", 
            lineHeight: 1.8,
            fontSize: { xs: "1rem", sm: "1.25rem" },
            textAlign: { xs: "center", sm: "left" }
          }}
        >
          Mutual Fund Explorer is your ultimate platform for discovering, comparing,
          and analyzing top mutual funds. Our mission is to empower investors with
          accurate, real-time data and easy-to-use tools to make informed decisions.
        </Typography>

        <Box sx={{ mt: { xs: 6, sm: 8 } }}>
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ 
              mb: 2, 
              color: "#00FF7F",
              fontSize: { xs: "1.5rem", sm: "2.125rem" },
              textAlign: { xs: "center", sm: "left" }
            }}
          >
            Our Mission
          </Typography>
          <Typography
            variant="body1"
            sx={{ 
              mb: 4, 
              color: "#90EE90", 
              lineHeight: 1.7,
              fontSize: { xs: "0.95rem", sm: "1.1rem" },
              textAlign: { xs: "center", sm: "left" }
            }}
          >
            To provide a modern, intuitive interface and reliable data to help investors
            of all experience levels grow their wealth smartly and confidently.
          </Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
          <Button 
            variant="contained" 
            size="large"
            onClick={() => router.push("/funds")}
            sx={{ 
              backgroundColor: "#00FF7F", 
              color: "#000", 
              fontWeight: "bold",
              borderRadius: 3,
              px: 6,
              py: 1.5,
              textTransform: "none",
              fontSize: "1.1rem",
              "&:hover": { backgroundColor: "#32CD32" }
            }}
          >
            Start Exploring
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
