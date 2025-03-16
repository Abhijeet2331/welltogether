"use client";
import { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import {
  getOrCreateUser,
  saveJournalEntry,
  getAllJournals
} from "@/firebaseService";

export default function JournalPage() {
  // New state for the journal title
  const [title, setTitle] = useState("");
  const [entry, setEntry] = useState("");
  const [userName, setUserName] = useState("");
  const [user, setUser] = useState(null);
  const [journals, setJournals] = useState([]);
  const [selectedJournal, setSelectedJournal] = useState(null);

  // When user info changes, load all journals for that user
  useEffect(() => {
    async function fetchJournalsForUser() {
      if (user && user.id) {
        try {
          const allJournals = await getAllJournals(user.id);
          setJournals(allJournals);
        } catch (err) {
          console.error("Failed to load journals:", err);
        }
      }
    }
    fetchJournalsForUser();
  }, [user]);

  const handleSave = async () => {
    if (!userName.trim() || !title.trim() || !entry.trim()) return;

    try {
      // Create or load the user based on the provided name.
      let currentUser = user;
      if (!currentUser) {
        currentUser = await getOrCreateUser(userName);
        setUser(currentUser);
      }

      // Save the journal entry with its title.
      await saveJournalEntry(currentUser.id, title, entry);
      alert("Journal entry saved!");
      setTitle("");
      setEntry("");

      // Reload journals after saving.
      const updatedJournals = await getAllJournals(currentUser.id);
      setJournals(updatedJournals);
    } catch (error) {
      console.error("Error saving journal entry:", error);
      alert("Failed to save journal entry. Check console for details.");
    }
  };

  const handleOpenJournal = (journal) => {
    setSelectedJournal(journal);
  };

  const handleCloseDialog = () => {
    setSelectedJournal(null);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" fontWeight="bold" textAlign="center">
        📖 Daily Journal
      </Typography>
      <Paper sx={{ p: 3, mt: 3, boxShadow: 3 }}>
        {/* User Name Field */}
        <TextField
          fullWidth
          label="Your Name"
          variant="outlined"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          sx={{ mb: 2 }}
        />
        {/* New Journal Title Field */}
        <TextField
          fullWidth
          label="Journal Title"
          variant="outlined"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ mb: 2 }}
        />
        {/* Journal Entry Field */}
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

      {/* Display saved journals */}
      {journals.length > 0 && (
        <>
          <Typography variant="h5" sx={{ mt: 4 }}>
            All Journals
          </Typography>
          {journals.map((journal) => (
            <Paper
              key={journal.id}
              sx={{
                mt: 2,
                p: 2,
                cursor: "pointer",
                "&:hover": { backgroundColor: "action.hover" }
              }}
              onClick={() => handleOpenJournal(journal)}
            >
              <Typography variant="subtitle1">
                {journal.title || "No Title"}
              </Typography>
            </Paper>
          ))}
        </>
      )}

      {/* Popup dialog for a selected journal */}
      <Dialog open={!!selectedJournal} onClose={handleCloseDialog} fullWidth>
        <DialogTitle>
          {selectedJournal ? selectedJournal.title : ""}
        </DialogTitle>
        <DialogContent dividers>
          {selectedJournal && (
            <>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {selectedJournal.entry}
              </Typography>
              {selectedJournal.date && (
                <Typography variant="caption" color="text.secondary">
                  {new Date(selectedJournal.date.seconds * 1000).toLocaleString()}
                </Typography>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} variant="outlined">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
