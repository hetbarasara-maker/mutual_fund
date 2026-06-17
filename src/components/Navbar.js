"use client";

import { useState } from "react";
import { 
    Box, 
    Typography, 
    Button, 
    IconButton, 
    Drawer, 
    List, 
    ListItem, 
    ListItemButton,
    ListItemText, 
    Divider 
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useRouter } from "next/navigation";

export default function Navbar() {
    const router = useRouter();
    const [mobileOpen, setMobileOpen] = useState(false);

    const navItems = [
        { label: "Home", path: "/" },
        { label: "Explore Funds", path: "/funds" },
        { label: "Active Funds", path: "/active-funds" },
        { label: "Rankings", path: "/rankings" },
        { label: "Watchlist", path: "/watchlist" },
        { label: "About", path: "/about" },
        { label: "Calculator", path: "/calculator" },
    ];

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleNavClick = (path) => {
        router.push(path);
        setMobileOpen(false);
    };

    return (
        <Box
            component="header"
            sx={{
                position: "sticky",
                top: 0,
                zIndex: 1000,
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                px: { xs: 2.5, sm: 5, md: 8 },
                py: 2,
                backgroundColor: "rgba(5, 5, 5, 0.7)",
                backdropFilter: "blur(20px)",
                borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                boxShadow: "0 4px 30px rgba(0, 0, 0, 0.4)",
            }}
        >
            <Typography
                variant="h6"
                sx={{
                    fontWeight: "bold",
                    letterSpacing: { xs: 0.5, sm: 1.2 },
                    color: "#00FF7F",
                    cursor: "pointer",
                    fontSize: { xs: "0.95rem", sm: "1.25rem" },
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    textShadow: "0 0 10px rgba(0, 255, 127, 0.5)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: { xs: "200px", sm: "none" },
                }}
                onClick={() => router.push("/")}
            >
                Mutual Fund Explorer
            </Typography>

            {/* Desktop Menu */}
            <Box sx={{ display: { xs: "none", lg: "flex" }, gap: 1 }}>
                {navItems.map((item) => (
                    <Button
                        key={item.label}
                        onClick={() => router.push(item.path)}
                        sx={{
                            color: "#00FF7F",
                            fontWeight: "bold",
                            textTransform: "none",
                            fontSize: "0.95rem",
                            borderRadius: 2,
                            px: 2,
                            py: 0.8,
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            "&:hover": {
                                backgroundColor: "rgba(0, 255, 127, 0.15)",
                                transform: "translateY(-2px)",
                                boxShadow: "0 4px 15px rgba(0, 255, 127, 0.4)",
                            },
                        }}
                    >
                        {item.label}
                    </Button>
                ))}
            </Box>

            {/* Mobile Menu Icon */}
            <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ 
                    display: { lg: "none" }, 
                    color: "#00FF7F",
                    "&:hover": { backgroundColor: "rgba(0, 255, 127, 0.1)" }
                }}
            >
                <MenuIcon />
            </IconButton>

            {/* Mobile Drawer */}
            <Drawer
                anchor="right"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                PaperProps={{
                    sx: {
                        width: 280,
                        backgroundColor: "#0a0a0a",
                        color: "#00FF7F",
                        borderLeft: "1px solid #00FF7F",
                    },
                }}
            >
                <Box sx={{ p: 2, display: "flex", justifyContent: "flex-end" }}>
                    <IconButton onClick={handleDrawerToggle} sx={{ color: "#00FF7F" }}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Divider sx={{ backgroundColor: "rgba(0, 255, 127, 0.2)" }} />
                <List sx={{ mt: 2 }}>
                    {navItems.map((item) => (
                        <ListItem key={item.label} disablePadding>
                            <ListItemButton 
                                onClick={() => handleNavClick(item.path)}
                                sx={{
                                    py: 2,
                                    "&:hover": {
                                        backgroundColor: "rgba(0, 255, 127, 0.1)",
                                    },
                                }}
                            >
                                <ListItemText 
                                    primary={item.label} 
                                    primaryTypographyProps={{
                                        fontWeight: "bold",
                                        fontSize: "1.1rem",
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer>
        </Box>
    );
}
