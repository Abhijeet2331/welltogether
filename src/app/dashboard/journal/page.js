"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import HomeIcon from "@mui/icons-material/Home";
import { useRouter } from "next/navigation";
import {
  getOrCreateUser,
  getAllJournals,
  saveJournalEntry,
  deleteJournalEntry,
} from "@/firebaseService";

export default function JournalPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [journals, setJournals] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [title, setTitle] = useState("");
  const [entry, setEntry] = useState("");

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.id) {
        setUser(parsedUser);
      } else {
        (async () => {
          const newUser = await getOrCreateUser(parsedUser.name);
          localStorage.setItem("user", JSON.stringify(newUser));
          setUser(newUser);
        })();
      }
    } else {
      console.error("No user found in localStorage");
    }
  }, []);

  // Fetch journals whenever user changes
  useEffect(() => {
    async function fetchJournals() {
      if (user && user.id) {
        try {
          const allJournals = await getAllJournals(user.id);
          setJournals(allJournals);
        } catch (err) {
          console.error("Failed to load journals:", err);
        }
      }
    }
    fetchJournals();
  }, [user]);

  // Open/close dialog for new entry
  const handleOpenDialog = () => {
    setTitle("");
    setEntry("");
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Save new journal entry
  const handleSave = async () => {
    if (!title.trim() || !entry.trim()) return;
    try {
      await saveJournalEntry(user.id, title, entry);
      const updatedJournals = await getAllJournals(user.id);
      setJournals(updatedJournals);
      handleCloseDialog();
    } catch (error) {
      console.error("Error saving journal entry:", error);
      alert("Failed to save journal entry. Check console for details.");
    }
  };

  // Delete journal entry
  const handleDelete = async (journalId) => {
    try {
      await deleteJournalEntry(user.id, journalId);
      const updatedJournals = await getAllJournals(user.id);
      setJournals(updatedJournals);
    } catch (err) {
      console.error("Failed to delete journal:", err);
    }
  };

  // Compute Month header from the first journal's date
  const getMonthHeader = () => {
    if (journals.length > 0 && journals[0].date) {
      const d = new Date(journals[0].date.seconds * 1000);
      const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      return `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
    }
    return "Your Journal";
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        backgroundImage: 'url("/myBackground.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        py: 4,
      }}
    >
      {/* Top Bar with Home Button */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", pr: 2 }}>
        <IconButton
          onClick={() => router.push("/dashboard")}
          sx={{
            border: "1px solid #000",
            borderRadius: 2,
            color: "#000",
            backgroundColor: "transparent",
            "&:hover": { backgroundColor: "#F8D24A" },
          }}
        >
          <HomeIcon />
        </IconButton>
      </Box>

      {/* Main Container */}
      <Box sx={{ width: "100%", maxWidth: 800, mx: "auto", p: 2 }}>
        {/* Journal Entry Heading */}
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
          Journal Entry
        </Typography>
        {/* Month Header */}
        <Typography variant="h5" sx={{ mb: 3, color: "gray" }}>
          {getMonthHeader()}
        </Typography>

        {/* List of Journal Entries */}
        {journals.length === 0 ? (
          <Typography variant="body1" sx={{ fontStyle: "italic", mt: 2 }}>
            No entries yet. Press the <AddCircleOutlineIcon sx={{ fontSize: 30, color: "#CDC1F3" }} /> icon to add a new entry!
          </Typography>
        ) : (
          journals.map((journal) => (
            <Paper
              key={journal.id}
              sx={{
                p: 2,
                mb: 2,
                display: "flex",
                alignItems: "center",
                border: "2px solid #000",
                borderRadius: 2,
              }}
            >
              {/* Date Circle */}
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  border: "2px solid #000",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mr: 2,
                }}
              >
                <Typography variant="h6">
                  {journal.date
                    ? new Date(journal.date.seconds * 1000).getDate()
                    : "?"}
                </Typography>
              </Box>

              {/* Journal Content */}
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  {journal.title || "Untitled"}
                </Typography>
                <Typography variant="body2" sx={{ color: "gray" }}>
                  {journal.entry.slice(0, 40)}...
                </Typography>
              </Box>

              {/* Delete Icon */}
              <IconButton onClick={() => handleDelete(journal.id)}>
                <DeleteIcon />
              </IconButton>
            </Paper>
          ))
        )}

        {/* Plus Icon for New Entry */}
        <Box sx={{ mt: 3, textAlign: "right" }}>
          <IconButton
            sx={{
              border: "2px solid #000",
              borderRadius: "50%",
              color: "#CDC1F3",
            }}
            onClick={handleOpenDialog}
          >
            <AddCircleOutlineIcon sx={{ fontSize: 30 }} />
          </IconButton>
        </Box>
      </Box>

      {/* Dialog for New Journal Entry */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>New Journal Entry</DialogTitle>
        <DialogContent>
          <TextField
            variant="outlined"
            label="Title"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            variant="outlined"
            label="Entry"
            fullWidth
            multiline
            rows={8}
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="text" onClick={handleCloseDialog}>
            Cancel
          </Button>
          <Button variant="contained" endIcon={<SaveIcon />} onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
