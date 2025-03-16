// JournalPage.js
"use client";
import { useState } from "react";
import { Container, TextField, Button, Typography, Paper } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { getOrCreateUser, saveJournalEntry } from "@/firebaseService";




export default function JournalPage() {
  const [entry, setEntry] = useState("");
  const [userName, setUserName] = useState("");
  const [user, setUser] = useState(null);

  const handleSave = async () => {
    if (!userName.trim() || !entry.trim()) return;

    // Get existing user or create a new one based on the entered name.
    let currentUser = user;
    if (!currentUser) {
      currentUser = await getOrCreateUser(userName);
      setUser(currentUser);
    }

    // Save the journal entry for the user.
    await saveJournalEntry(currentUser.id, entry);
    alert("Journal entry saved!");
    setEntry("");
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" fontWeight="bold" textAlign="center">
        📖 Daily Journal
      </Typography>
      <Paper sx={{ p: 3, mt: 3, boxShadow: 3 }}>
        <TextField
          fullWidth
          label="Your Name"
          variant="outlined"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          sx={{ mb: 2 }}
        />
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
        <Button
          variant="contained"
          color="primary"
          fullWidth
          endIcon={<SaveIcon />}
          onClick={handleSave}
        >
          Save Entry
        </Button>
      </Paper>
    </Container>
  );
}
