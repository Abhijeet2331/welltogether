"use client";

import React, { useState, useEffect } from "react";
import { Box, IconButton, Typography, Grid, Paper } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useRouter } from "next/navigation";

export default function SecondPage() {
  const router = useRouter();
  const [userName, setUserName] = useState("");

  // Pull user name from localStorage (simulate Firebase or prior screen)
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserName(parsedUser.name || "");
    }
  }, []);

  // Define your feature cards with pastel backgrounds
  const features = [
    {
      name: "Chat & Call",
      iconSrc: "/chat-call.png",
      route: "/dashboard/chat",
      bgColor: "#C8F7C5", // Light green
    },
    {
      name: "Success Stories",
      iconSrc: "/success-stories.png",
      route: "/dashboard/stories",
      bgColor: "#FFEB99", // Light blue
    },
    {
      name: "Play with Friends",
      iconSrc: "/play-friends.png",
      route: "/dashboard/games",
      bgColor: "#E5C5FC", // Light purple
    },
    {
      name: "Journal Entry",
      iconSrc: "/journal-entry.png",
      route: "/dashboard/journal",
      bgColor: "#B8DFF8", // Another light blue
    },
    {
      name: "Happy Bot",
      iconSrc: "/happy-bot.png",
      route: "/dashboard/happy-gpt",
      bgColor: "#FFC1D7", // Light pink
    },
    {
      name: "Watch Party",
      iconSrc: "/watch-party.png",
      route: "/dashboard/watch-party",
      bgColor: "#B8E8FC", // Light yellow
    },
  ];

  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
        // Full-page background
        backgroundImage: 'url("/myBackground.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",

        // Center content
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Hamburger menu at top-left
      <Box sx={{ position: "absolute", top: 20, left: 20 }}>
        <IconButton sx={{ color: "black" }}>
          <MenuIcon />
        </IconButton>
      </Box> */}

      {/* Greeting text, larger & centered */}
      <Typography
        variant="h1"
        sx={{ 
          fontWeight: "bold",
          color: "#70342B",
          textAlign: "center",
          mb: 1
        }}
      >
        Hello, {userName || "Friend"}!
      </Typography>
      <Typography
        variant="h4"
        sx={{
          color: "black",
          textAlign: "center",
          mb: 5,
        }}
      >
        How can we make your day better?
      </Typography>

      {/* Features Grid (large boxes) */}
      <Grid container spacing={5} justifyContent="center" alignItems="center">
        {features.map((feature, index) => (
          <Grid item key={index}>
            <Paper
              sx={{
                width: 220,
                height: 220,
                borderRadius: 6,
                backgroundColor: feature.bgColor,
                boxShadow: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "opacity 0.3s ease",
                "&:hover": {
                  opacity: 0.85,
                },
              }}
              onClick={() => router.push(feature.route)}
            >
              {/* Icon */}
              <Box sx={{ mb: 2 }}>
                <img
                  src={feature.iconSrc}
                  alt={feature.name}
                  style={{ width: 100, height: 100 }}
                />
              </Box>
              {/* Label */}
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", color: "black", textAlign: "center" }}
              >
                {feature.name}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
