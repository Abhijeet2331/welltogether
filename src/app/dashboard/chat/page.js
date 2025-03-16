"use client";
import { useState, useEffect } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Divider,
  ListItemButton,
  ListItemText,
  Paper,
  TextField,
  IconButton,
  Button,
  Badge
} from "@mui/material";
import { Send as SendIcon, Mic, MicOff, Headset, CallEnd } from "@mui/icons-material";
import { sendChatMessage, subscribeToChatMessages } from "@/firebaseService";

export default function ChatCallPage() {
  // Chat groups state
  const groups = [
    "General Chat",
    "Disease Based Chat",
    "Support Groups",
    "Talk to Psychologist"
  ];
  const [selectedGroup, setSelectedGroup] = useState("General Chat");

  // Chat messages state
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");

  // Voice call users (simulate for now)
  const [voiceUsers, setVoiceUsers] = useState([
    { id: 1, name: "Alice", active: true, isSpeaking: true },
    { id: 2, name: "Bob", active: true, isSpeaking: false }
  ]);

  // Realtime user state (the logged-in user's info)
  const [user, setUser] = useState(null);

  // Retrieve the logged-in user's info on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Subscribe to messages when the group changes.
  useEffect(() => {
    const unsubscribe = subscribeToChatMessages(selectedGroup, setMessages);
    return () => unsubscribe();
  }, [selectedGroup]);

  const handleSendMessage = async () => {
    if (!messageInput.trim()) return;

    // Use the logged-in user's name; if not available, default to "Anonymous"
    const senderName = user?.name || "Anonymous";

    const messageData = {
      sender: senderName,
      text: messageInput
    };

    try {
      // Send the message to Firestore under the selected group.
      await sendChatMessage(selectedGroup, messageData);
      setMessageInput("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* Left Column: Chat Groups */}
      <Box sx={{ width: 250, borderRight: "1px solid #ddd", p: 2 }}>
        <Typography variant="h6">Chat Groups</Typography>
        <Divider sx={{ my: 1 }} />
        {groups.map((group) => (
          <ListItemButton
            key={group}
            selected={selectedGroup === group}
            onClick={() => setSelectedGroup(group)}
          >
            <ListItemText primary={group} />
          </ListItemButton>
        ))}
      </Box>

      {/* Middle Column: Chat Window */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <AppBar position="static" color="default" sx={{ boxShadow: 1 }}>
          <Toolbar>
            <Typography variant="h6">{selectedGroup}</Typography>
          </Toolbar>
        </AppBar>
        <Box sx={{ flex: 1, p: 2, overflowY: "auto" }}>
          {messages.map((msg) => (
            <Paper key={msg.id} sx={{ p: 1, mb: 1 }}>
              <Typography variant="caption" color="textSecondary">
                {msg.sender} •{" "}
                {msg.timestamp && msg.timestamp.seconds
                  ? new Date(msg.timestamp.seconds * 1000).toLocaleTimeString()
                  : ""}
              </Typography>
              <Typography variant="body1">{msg.text}</Typography>
            </Paper>
          ))}
        </Box>
        <Box sx={{ p: 2, borderTop: "1px solid #ddd", display: "flex" }}>
          <TextField
            fullWidth
            placeholder="Type a message..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") handleSendMessage();
            }}
          />
          <IconButton color="primary" onClick={handleSendMessage}>
            <SendIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Right Column: Voice Call Section */}
      <Box sx={{ width: 250, borderLeft: "1px solid #ddd", p: 2 }}>
        <Typography variant="h6">Voice Call</Typography>
        <Divider sx={{ my: 1 }} />
        {voiceUsers.map((user) => (
          <Box
            key={user.id}
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 1,
              p: 1,
              borderRadius: 1,
              bgcolor: user.isSpeaking ? "rgba(76, 175, 80, 0.1)" : "transparent"
            }}
          >
            <Badge
              color="primary"
              variant="dot"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  bgcolor: "grey.400",
                  mr: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                {user.name.charAt(0)}
              </Box>
            </Badge>
            <Typography variant="body1">{user.name}</Typography>
          </Box>
        ))}
        <Divider sx={{ my: 1 }} />
        <Button variant="contained" fullWidth sx={{ mb: 1 }}>
          Join Voice Channel
        </Button>
        <Button variant="outlined" fullWidth>
          Leave Voice Channel
        </Button>
      </Box>
    </Box>
  );
}
