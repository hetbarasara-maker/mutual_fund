"use client";
import { Box, Typography } from "@mui/material";

const marketData = [
    { label: "NIFTY 50", value: "22,453.30", change: "+0.85%", up: true },
    { label: "SENSEX", value: "73,903.91", change: "+1.12%", up: true },
    { label: "BANK NIFTY", value: "48,150.25", change: "-0.15%", up: false },
    { label: "GOLD", value: "71,500.00", change: "+0.45%", up: true },
    { label: "USD/INR", value: "83.45", change: "-0.02%", up: false },
    { label: "CRUDE OIL", value: "82.10", change: "+1.20%", up: true },
];

export default function MarketMarquee() {
    return (
        <Box
            sx={{
                width: "100%",
                backgroundColor: "rgba(0,0,0,0.8)",
                borderBottom: "1px solid rgba(255,255,255,0.1)",
                py: 0.5,
                overflow: "hidden",
                whiteSpace: "nowrap",
                position: "relative",
                zIndex: 900,
            }}
        >
            <Box
                sx={{
                    display: "inline-block",
                    animation: "marquee 30s linear infinite",
                }}
            >
                {[...marketData, ...marketData].map((item, idx) => (
                    <Box
                        key={idx}
                        sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            mx: 4,
                            gap: 1,
                        }}
                    >
                        <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.6)", fontWeight: "bold" }}>
                            {item.label}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#fff", fontWeight: "bold" }}>
                            {item.value}
                        </Typography>
                        <Typography
                            variant="caption"
                            sx={{
                                color: item.up ? "#00FF7F" : "#FF3131",
                                fontWeight: "bold",
                            }}
                        >
                            {item.change}
                        </Typography>
                    </Box>
                ))}
            </Box>

            <style jsx global>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
            `}</style>
        </Box>
    );
}
