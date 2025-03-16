"use client";

import React from "react";
import { Box, IconButton, Typography, Grid, Paper } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChatIcon from "@mui/icons-material/Chat";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import CreateIcon from "@mui/icons-material/Create";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import MovieIcon from "@mui/icons-material/Movie";

export default function SecondPage() {
  // Define your feature cards
  const features = [
    { label: "Chat & Call", icon: <ChatIcon fontSize="large" /> },
    { label: "Success Stories", icon: <EmojiEventsIcon fontSize="large" /> },
    { label: "Play with your Friends", icon: <SportsEsportsIcon fontSize="large" /> },
    { label: "Journal Entry", icon: <CreateIcon fontSize="large" /> },
    { label: "Happy Bot", icon: <WbSunnyIcon fontSize="large" /> },
    { label: "Watch Party", icon: <MovieIcon fontSize="large" /> },
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
        backgroundImage: 'url("/myBackground.png")', // Image from public folder
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Top bar with hamburger menu */}
      <Box sx={{ display: "flex", alignItems: "center", p: 3 }}>
        <IconButton sx={{ color: "black" }}>
          <MenuIcon />
        </IconButton>
      </Box>

      {/* Greeting text */}
      <Box sx={{ ml: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          Hello, Samir!
        </Typography>
        <Typography variant="subtitle1" sx={{ mt: 1 }}>
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
                  p: 2,
                  textAlign: "center",
                  borderRadius: 4,
                  backgroundColor: "#F4FCFA",
                  boxShadow: 3,
                  height: 120,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "#DBF2EC",
                  },
                }}
                onClick={() => {
                  // Route to relevant page or handle click action
                }}
              >
                <Box sx={{ color: "#3B3B3B", mb: 1 }}>{feature.icon}</Box>
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  {feature.label}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
