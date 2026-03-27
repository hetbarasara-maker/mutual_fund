"use client";

import { Box, Typography, Button } from "@mui/material";
import { useRouter } from "next/navigation";

export default function Navbar() {
    const router = useRouter();

    return (
        <Box
            component="header"
            sx={{
                position: "sticky",
                top: 0,
                zIndex: 1000,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                px: { xs: 2, sm: 6 },
                py: 2.5,
                backgroundColor: "rgba(0, 255, 127, 0.1)",
                backdropFilter: "blur(10px)",
                boxShadow: "0 2px 10px rgba(0,255,127,0.3)",
            }}
        >
            <Typography
                variant="h6"
                sx={{
                    fontWeight: "bold",
                    letterSpacing: 1,
                    color: "#00FF7F",
                    cursor: "pointer",
                }}
                onClick={() => router.push("/")}
            >
                Mutual Fund Explorer
            </Typography>

            <Box sx={{ display: "flex", gap: 0.5 }}>
                {[
                    { label: "Home", path: "/" },
                    { label: "Explore Funds", path: "/funds" },
                    { label: "Active Funds", path: "/active-funds" },
                    { label: "Rankings", path: "/rankings" },
                    { label: "Watchlist", path: "/watchlist" },
                    { label: "About", path: "/about" },
                    { label: "Calculator", path: "/calculator" },
                ].map((item) => (
                    <Button
                        key={item.label}
                        onClick={() => router.push(item.path)}
                        sx={{
                            color: "#00FF7F",
                            fontWeight: "bold",
                            textTransform: "none",
                            fontSize: "1rem",
                            borderRadius: 2,
                            px: 2.5,
                            py: 1,
                            transition: "all 0.3s ease",
                            "&:hover": {
                                backgroundColor: "rgba(0,255,127,0.2)",
                                transform: "scale(1.05)",
                                boxShadow: "0 0 10px #00FF7F",
                            },
                        }}
                    >
                        {item.label}
                    </Button>
                ))}
            </Box>
        </Box>
    );
}
