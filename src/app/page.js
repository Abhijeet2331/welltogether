"use client";
import { Container, Typography, Button, TextField, Box } from "@mui/material";
import { useRouter } from "next/navigation";
import ChatIcon from "@mui/icons-material/Chat";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CreateIcon from "@mui/icons-material/Create";
import MovieIcon from "@mui/icons-material/Movie";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [name, setName] = useState("");

  return (
    <Container
      maxWidth="sm"
      sx={{
        textAlign: "center",
        mt: 10,
        background: "white",
        padding: 4,
        borderRadius: 3,
        boxShadow: 3,
      }}
    >
      <Typography variant="h4" fontWeight="bold" color="primary">
        Welcome to WellTogether
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" sx={{ mt: 1 }}>
        Enter your name to continue
      </Typography>
      <TextField
        fullWidth
        variant="outlined"
        label="Your Name"
        sx={{ mt: 3 }}
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Button
        fullWidth
        variant="contained"
        color="primary"
        sx={{ mt: 3 }}
        onClick={() => router.push("/dashboard")}
      >
        Continue
      </Button>
    </Container>
  );
}
