"use client";

import { Box } from "@mui/material";

export default function Footer() {
    return (
        <Box
            component="footer"
            sx={{
                py: 3,
                textAlign: "center",
                backgroundColor: "#111",
                color: "#00FF7F",
                fontSize: "0.9rem",
                borderTop: "1px solid #00FF7F",
                boxShadow: "0 -2px 20px rgba(0,255,127,0.2)",
            }}
        >
            © {new Date().getFullYear()} Mutual Fund Explorer — Designed with 💚 by H.B Patel
        </Box>
    );
}
