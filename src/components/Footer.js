"use client";

import { Box } from "@mui/material";

export default function Footer() {
    return (
        <Box
            component="footer"
            sx={{
                py: { xs: 2.5, sm: 3 },
                px: { xs: 2, sm: 4 },
                width: "100%",
                textAlign: "center",
                backgroundColor: "#111",
                color: "#00FF7F",
                fontSize: { xs: "0.75rem", sm: "0.9rem" },
                borderTop: "1px solid rgba(0,255,127,0.3)",
                boxShadow: "0 -2px 20px rgba(0,255,127,0.2)",
                wordBreak: "break-word",
            }}
        >
            © {new Date().getFullYear()} Mutual Fund Explorer — Designed with 💚 by H.B Patel
        </Box>
    );
}
