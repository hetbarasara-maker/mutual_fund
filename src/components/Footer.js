"use client";

import { Box, Typography } from "@mui/material";

export default function Footer() {
    return (
        <Box
            component="footer"
            sx={{
                py: { xs: 3, sm: 4 },
                px: { xs: 2, sm: 4 },
                width: "100%",
                textAlign: "center",
                backgroundColor: "rgba(5, 5, 5, 0.85)",
                backdropFilter: "blur(12px)",
                borderTop: "1px solid rgba(255, 255, 255, 0.05)",
                wordBreak: "break-word",
            }}
        >
            <Typography 
                variant="body2" 
                sx={{ 
                    color: "rgba(255, 255, 255, 0.5)", 
                    fontWeight: 500, 
                    display: "inline",
                    fontSize: { xs: "0.8rem", sm: "0.9rem" }
                }}
            >
                &copy; {new Date().getFullYear()} Mutual Fund Explorer. All rights reserved.
            </Typography>
            <Typography 
                variant="body2" 
                sx={{ 
                    color: "rgba(255, 255, 255, 0.5)", 
                    fontWeight: 500, 
                    display: "inline",
                    fontSize: { xs: "0.8rem", sm: "0.9rem" }
                }}
            >
                {" — "}Designed with <span style={{ color: "#00FF7F", textShadow: "0 0 10px rgba(0, 255, 127, 0.6)" }}>💚</span> by H.B Patel
            </Typography>
        </Box>
    );
}
