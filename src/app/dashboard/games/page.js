"use client"; // ✅ Ensures this is a Client Component

import React from "react"; // ✅ Import React explicitly
import { Container, Typography, Grid, Paper, Button } from "@mui/material";

const GamesPage = () => {
  const games = [
    { name: "Skribbl.io", image: "/skribbl.jpeg", link: "https://skribbl.io/" },
    { name: "Chess.com", image: "/chess.jpeg", link: "https://www.chess.com/play" },
    { name: "Tic-Tac-Toe", image: "/tic-tac-toe.jpeg", link: "https://playtictactoe.org/" },
  ];

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Typography variant="h4" fontWeight="bold" textAlign="center" sx={{ mb: 3 }}>
        🎮 Multiplayer Games
      </Typography>
      <Grid container spacing={3}>
        {games.map((game, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Paper sx={{ p: 2, textAlign: "center", borderRadius: 2, boxShadow: 3 }}>
              <img 
                src={game.image} 
                alt={game.name} 
                style={{ width: "100%", borderRadius: "10px" }} 
                onError={(e) => e.target.style.display = "none"} // ✅ Hides broken images
              />
              <Typography variant="h6" sx={{ mt: 2 }}>{game.name}</Typography>
              <Button variant="contained" color="primary" sx={{ mt: 1 }} href={game.link} target="_blank">
                Play Now
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default GamesPage; // ✅ Correct export
