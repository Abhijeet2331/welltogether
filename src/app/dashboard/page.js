"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Container, Typography, Button, Grid } from "@mui/material"; // ✅ Use standard Grid

export default function Dashboard() {
  const [characterName, setCharacterName] = useState("");
  const router = useRouter();

  useEffect(() => {
    const storedName = typeof window !== "undefined" ? localStorage.getItem("characterName") : "";
    if (storedName) {
      setCharacterName(storedName);
    } else {
      router.push("/"); // Redirect to home if no name is found
    }
  }, [router]);

  return (
    <Container maxWidth="sm" style={{ textAlign: "center", marginTop: "50px" }}>
      <Typography variant="h4" gutterBottom>
        Welcome, {characterName}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Choose an option below:
      </Typography>

      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => router.push("/dashboard/chat")}
          >
            🗨️ Chat / Call
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="secondary" fullWidth>
            📅 Appointments
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="success" fullWidth>
            🏥 Hospital Services
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="warning" fullWidth>
            📑 Medical Records
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="info" fullWidth>
            ⚙️ Settings
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}
