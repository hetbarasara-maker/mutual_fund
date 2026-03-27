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
      <Container maxWidth="md" sx={{ flex: 1, py: 8 }}>
        <Typography
          variant="h3"
          fontWeight="bold"
          align="center"
          sx={{ mb: 6, color: "#00FF7F" }}
        >
          About Mutual Fund Explorer
        </Typography>

        <Typography
          variant="h6"
          sx={{ mb: 4, color: "#90EE90", lineHeight: 1.8 }}
        >
          Mutual Fund Explorer is your ultimate platform for discovering, comparing,
          and analyzing top mutual funds. Our mission is to empower investors with
          accurate, real-time data and easy-to-use tools to make informed decisions.
        </Typography>

        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{ mb: 2, color: "#00FF7F" }}
        >
          Our Mission
        </Typography>
        <Typography
          variant="body1"
          sx={{ mb: 4, color: "#90EE90", lineHeight: 1.7 }}
        >
          To provide a modern, intuitive interface and reliable data to help investors
          of all experience levels grow their wealth smartly and confidently.
        </Typography>
      </Container>
    </Box>
  );
}
