"use client";

import React, { useState } from "react";
import { Box, Typography, Grid, Paper, Button, IconButton } from "@mui/material";
import { useRouter } from "next/navigation";
import HomeIcon from "@mui/icons-material/Home";

const gameList = [
  {
    name: "Gartic Phone",
    image: "/games_img/01.png",
    link: "https://garticphone.com",
  },
  {
    name: "Miniblox",
    image: "/games_img/02.png",
    link: "https://www.crazygames.com/game/miniblox   ",
  },
  {
    name: "Skribbl.io",
    image: "/games_img/03.png",
    link: "https://skribbl.io/",
  },
  {
    name: "Codenames Online",
    image: "/games_img/04.png",
    link: "https://codenames.game/",
  },
  {
    name: "4 Colors",
    image: "/games_img/05.png",
    link: "https://www.crazygames.com/game/uno-online",
  },
  {
    name: "Shell Shockers",
    image: "/games_img/06.png",
    link: "https://shellshock.io/",
  },
];

export default function GamesPage() {
  const router = useRouter();
  const [selectedGame, setSelectedGame] = useState(null);

  // Identify the active game object (if any)
  const activeGame = selectedGame
    ? gameList.find((g) => g.link === selectedGame)
    : null;

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        position: "relative",
        backgroundImage: 'url("/gamesbackground.png")', // Use your own background image from public folder
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
     
      

      {/* Main Content */}
      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          p: { xs: 2, md: 5 },
          display: "flex",
          flexDirection: "column",
          height: "100%",
          overflow: "auto",
        }}
      >
        {/* Header row: Title on left, Home button on right */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Box>
            {/* Title row with dice image */}
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                color: "#70342B",
                display: "flex",
                alignItems: "center",
              }}
            >
              Play with your Friends
              <img
                src="/dice.png"
                alt="Dice"
                style={{ width: "40px", marginLeft: "8px" }}
              />
            </Typography>
            <Typography variant="subtitle1" sx={{ mt: 1, color: "black" }}>
              You and your best pal looking for some game time?
            </Typography>
          </Box>
          <IconButton
            sx={{
              color: "#70342B",
              border: "1px solid #70342B",
              borderRadius: 2,
              "&:hover": { backgroundColor: "#F8D24A" },
            }}
            onClick={() => router.push("/dashboard")} // or your home route
          >
            <HomeIcon />
          </IconButton>
        </Box>

        {/* Game Cards */}
        <Box sx={{ flex: "0 0 auto" }}>
          <Grid container spacing={3}>
            {gameList.map((game, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper
                  sx={{
                    p: 2,
                    textAlign: "center",
                    borderRadius: 2,
                    boxShadow: 3,
                    height: 280,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  {/* Image container with fixed aspect ratio */}
                  <Box
                    sx={{
                      width: "100%",
                      height: "200px",
                      position: "relative",
                      overflow: "hidden",
                      borderRadius: "10px",
                      mb: 1,
                    }}
                  >
                    <img
                      src={game.image}
                      alt={game.name}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      onError={(e) => (e.target.style.display = "none")}
                    />
                  </Box>
                  <Typography variant="h6" sx={{ mt: 1 }}>
                    {game.name}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setSelectedGame(game.link)}
                  >
                    Play Now
                  </Button>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>

      {/* Full-Screen Overlay if a game is selected */}
      {selectedGame && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "white",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Overlay Header */}
          <Box
            sx={{
              p: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "#f5f5f5",
              borderBottom: "1px solid #ccc",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {activeGame?.name || "Loading..."}
            </Typography>
            <Button
              variant="outlined"
              onClick={() => setSelectedGame(null)}
              sx={{ fontWeight: "bold" }}
            >
              Back to Menu
            </Button>
          </Box>

          {/* Iframe Container */}
          <Box sx={{ flex: 1 }}>
            <iframe
              src={selectedGame}
              title="Game Frame"
              style={{
                width: "100%",
                height: "100%",
                border: "none",
              }}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
}
