"use client";

import React from "react";
import { Box, IconButton, Typography, Grid, Paper } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChatIcon from "@mui/icons-material/Chat";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import CreateIcon from "@mui/icons-material/Create";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import MovieIcon from "@mui/icons-material/Movie";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { useRouter } from "next/navigation";

export default function SecondPage() {
  const router = useRouter();
  
  // Define your feature cards
  const features = [
    { name: "Call & Chat", icon: <ChatIcon fontSize="large" />, route: "/dashboard/chat" },
    { name: "Multiplayer Games", icon: <SportsEsportsIcon fontSize="large" />, route: "/dashboard/games" },
    { name: "Happy ChatGPT", icon: <AutoAwesomeIcon fontSize="large" />, route: "/dashboard/happy-gpt" },
    { name: "Daily Journal", icon: <CreateIcon fontSize="large" />, route: "/dashboard/journal" },
    { name: "Watch Party", icon: <MovieIcon fontSize="large" />, route: "/dashboard/watch-party" },
    { name: "Success Stories", icon: <EmojiEventsIcon fontSize="large" />, route: "/dashboard/stories" },
  ];

  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        margin: 0,
        padding: 0,
        position: "relative",
        overflow: "hidden",
        backgroundImage: 'url("/myBackground.png")', // Ensure this image is in the public folder
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Top Bar with Hamburger Menu */}
      <Box sx={{ display: "flex", alignItems: "center", p: 3 }}>
        <IconButton sx={{ color: "black" }}>
          <MenuIcon />
        </IconButton>
      </Box>

      {/* Greeting Text */}
      <Box sx={{ ml: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#70342B" }}>
          Hello, Samir!
        </Typography>
        <Typography variant="subtitle1" sx={{ mt: 1, color: "black" }}>
          How can we make your day better?
        </Typography>
      </Box>

      {/* Features Grid */}
      <Box sx={{ mt: 4, ml: 4 }}>
        <Grid container spacing={3} sx={{ maxWidth: 800 }}>
          {features.map((feature, index) => (
            <Grid item xs={6} md={4} key={index}>
              <Paper
                sx={{
                  p: 3,
                  textAlign: "center",
                  borderRadius: 4,
                  backgroundColor: "#F4FCFA",
                  boxShadow: 3,
                  height: 140,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "#DBF2EC",
                  },
                }}
                onClick={() => router.push(feature.route)}
              >
                <Box sx={{ color: "#3B3B3B", mb: 1 }}>
                  {feature.icon}
                </Box>
                <Typography variant="body1" sx={{ fontWeight: "bold", color: "black" }}>
                  {feature.name}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
