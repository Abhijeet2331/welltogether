"use client";
import { Container, Typography, Button, TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getOrCreateUser } from "../firebaseService.js"; // Adjust the path as needed

export default function Home() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (!name.trim()) return;
    setLoading(true);
    try {
      // Get existing user data or create a new user based on the provided name.
      const user = await getOrCreateUser(name);
      // Save user data locally so you can use it in subsequent pages.
      localStorage.setItem("user", JSON.stringify(user));
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to get or create user:", error);
    } finally {
      setLoading(false);
    }
  };

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
        onClick={handleContinue}
        disabled={loading}
      >
        {loading ? "Loading..." : "Continue"}
      </Button>
    </Container>
  );
}
