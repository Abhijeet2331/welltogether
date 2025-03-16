"use client"; // ✅ Ensures this is a Client Component

import { useState } from "react";
import { Container, TextField, Button, Typography, Paper } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

export default function JournalPage() {
  const [entry, setEntry] = useState("");

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" fontWeight="bold" textAlign="center">
        📖 Daily Journal
      </Typography>
      <Paper sx={{ p: 3, mt: 3, boxShadow: 3 }}>
        <TextField
          fullWidth
          label="Write your thoughts..."
          variant="outlined"
          multiline
          rows={6}
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button variant="contained" color="primary" fullWidth endIcon={<SaveIcon />}>
          Save Entry
        </Button>
      </Paper>
    </Container>
  );
}
