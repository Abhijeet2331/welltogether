"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TextField, Button, Container, Typography } from "@mui/material";

export default function Home() {
  const [name, setName] = useState("");
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  // Ensure the component is mounted before accessing localStorage
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSubmit = () => {
    if (name.trim() === "") return;
    
    if (typeof window !== "undefined") {
      localStorage.setItem("characterName", name);
    }

    router.push("/dashboard"); // Navigate to the dashboard
  };

  if (!isMounted) {
    return null; // Prevent rendering on the server
  }

  return (
    <Container maxWidth="sm" style={{ textAlign: "center", marginTop: "100px" }}>
      <Typography variant="h4" gutterBottom>
        Enter Your Character Name
      </Typography>
      <TextField
        label="Character Name"
        variant="outlined"
        fullWidth
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ marginBottom: "20px" }}
      />
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Continue
      </Button>
    </Container>
  );
}
