"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  CssBaseline,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  TextField,
  Button,
  IconButton,
  Avatar,
  Badge
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Groups,
  LocalHospital,
  Celebration,
  Psychology,
  Send as SendIcon,
  Mic as MicIcon,
  CallEnd as CallEndIcon
} from "@mui/icons-material";
import {
  subscribeToChatMessages,
  sendChatMessage,
  subscribeToActiveUsers,
  setUserVoiceStatus
} from "@/firebaseService";

const drawerWidth = 250;
const voiceDrawerWidth = 250;

const ChatContainer = styled("div")(({ theme }) => ({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  backgroundColor: "#fafafa",
}));

const MessageList = styled("div")(({ theme }) => ({
  flex: 1,
  overflowY: "auto",
  padding: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
}));

// Use shouldForwardProp to filter out "isUser"
const MessageBubble = styled(Paper, {
  shouldForwardProp: (prop) => prop !== "isUser"
})(({ theme, isUser }) => ({
  maxWidth: "70%",
  alignSelf: isUser ? "flex-end" : "flex-start",
  padding: theme.spacing(1),
  borderRadius: theme.spacing(2),
  backgroundColor: isUser ? "#e0f7fa" : "#f3e5f5",
}));

export default function ChatCallPage() {
  const [activeGroup, setActiveGroup] = useState("General Chat");
  const groups = [
    { label: "General Chat", icon: <Groups /> },
    { label: "Disease Based Chat", icon: <LocalHospital /> },
    { label: "Support Groups", icon: <Celebration /> },
    { label: "Talk to Psychologist", icon: <Psychology /> },
  ];

  // Chat messages
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");

  // Active voice users
  const [voiceUsers, setVoiceUsers] = useState([]);
  const [inVoiceChannel, setInVoiceChannel] = useState(false);

  // Current user from localStorage
  const [user, setUser] = useState(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
    } else {
      console.warn("No user found in localStorage. Voice presence won't work properly.");
    }
  }, []);

  // Subscribe to messages for activeGroup using subscribeToChatMessages
  useEffect(() => {
    const unsubscribe = subscribeToChatMessages(activeGroup, (msgs) => {
      setMessages(
        msgs.map((m) => ({
          id: m.id,
          sender: m.sender || "Unknown",
          text: m.text || "",
          timestamp: m.timestamp?.toDate?.() || new Date(),
        }))
      );
    });
    return () => unsubscribe && unsubscribe();
  }, [activeGroup]);

  // Subscribe to active voice users
  useEffect(() => {
    const unsubscribe = subscribeToActiveUsers((activeUsers) => {
      setVoiceUsers(activeUsers);
    });
    return () => unsubscribe && unsubscribe();
  }, []);

  // Send a new chat message
  const handleSendMessage = async () => {
    if (!messageInput.trim()) return;
    const newMsg = {
      sender: user?.name || "You",
      text: messageInput,
    };
    setMessageInput("");
    try {
      await sendChatMessage(activeGroup, newMsg);
    } catch (err) {
      console.error("Failed to send chat message:", err);
    }
  };

  // Join voice channel
  const handleJoinVoice = async () => {
    if (!user?.id) {
      console.warn("No user. Cannot join voice channel.");
      return;
    }
    try {
      await setUserVoiceStatus(user.id, true);
      setInVoiceChannel(true);
    } catch (err) {
      console.error("Failed to join voice channel:", err);
    }
  };

  // Leave voice channel
  const handleLeaveVoice = async () => {
    if (!user?.id) return;
    try {
      await setUserVoiceStatus(user.id, false);
      setInVoiceChannel(false);
    } catch (err) {
      console.error("Failed to leave voice channel:", err);
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <CssBaseline />

      {/* Left Drawer - Chat Groups */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#f3e5f5",
          },
        }}
      >
        <Box sx={{ height: 64 }} />
        <Box sx={{ overflow: "auto" }}>
          <Typography variant="h6" sx={{ textAlign: "center", mt: 2 }}>
            Chat Groups
          </Typography>
          <Divider sx={{ my: 1 }} />
          <List>
            {groups.map((g, index) => (
              <ListItemButton
                key={index}
                selected={activeGroup === g.label}
                onClick={() => setActiveGroup(g.label)}
              >
                <ListItemIcon>{g.icon}</ListItemIcon>
                <ListItemText primary={g.label} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Middle Column - Chat Window */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Top bar for active group */}
        <AppBar
          position="static"
          sx={{ backgroundColor: "#ce93d8", boxShadow: 1, height: 64, justifyContent: "center" }}
        >
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              {activeGroup}
            </Typography>
          </Toolbar>
        </AppBar>
        <ChatContainer>
          <MessageList>
            {messages.map((m) => (
              <MessageBubble key={m.id} isUser={m.sender === (user?.name || "You")}>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  {m.sender} • {m.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </Typography>
                <Typography variant="body1">{m.text}</Typography>
              </MessageBubble>
            ))}
          </MessageList>
          {/* Input box */}
          <Box
            sx={{
              display: "flex",
              p: 2,
              borderTop: "1px solid #ddd",
            }}
          >
            <TextField
              fullWidth
              placeholder="Type a message..."
              variant="outlined"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <Button
              variant="contained"
              sx={{ ml: 1, backgroundColor: "#ab47bc" }}
              onClick={handleSendMessage}
            >
              <SendIcon />
            </Button>
          </Box>
        </ChatContainer>
      </Box>

      {/* Right Drawer - Voice Channel */}
      <Drawer
        variant="permanent"
        anchor="right"
        sx={{
          width: voiceDrawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: voiceDrawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#f3e5f5",
          },
        }}
      >
        <Box sx={{ height: 64 }} />
        <Box sx={{ overflow: "auto", p: 2 }}>
          <Typography variant="h6" textAlign="center">
            Voice Channel
          </Typography>
          <Divider sx={{ my: 1 }} />
          {/* Active voice users */}
          {voiceUsers.map((u) => (
            <Box
              key={u.id}
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 2,
                p: 1,
                borderRadius: 1,
                bgcolor: "rgba(255, 204, 128, 0.2)",
              }}
            >
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                variant="dot"
                sx={{
                  "& .MuiBadge-badge": {
                    backgroundColor: "#66bb6a",
                  },
                }}
              >
                <Avatar>{u.name.charAt(0)}</Avatar>
              </Badge>
              <Typography variant="body1" sx={{ ml: 1 }}>
                {u.name}
              </Typography>
            </Box>
          ))}
          <Divider sx={{ my: 1 }} />
          {/* Join / Leave Voice */}
          {!inVoiceChannel ? (
            <Button
              variant="contained"
              startIcon={<MicIcon />}
              sx={{ mt: 2, width: "100%", backgroundColor: "#ab47bc" }}
              onClick={handleJoinVoice}
            >
              Join Voice
            </Button>
          ) : (
            <Button
              variant="contained"
              startIcon={<CallEndIcon />}
              color="error"
              sx={{ mt: 2, width: "100%" }}
              onClick={handleLeaveVoice}
            >
              Leave Voice
            </Button>
          )}
        </Box>
      </Drawer>
    </Box>
  );
}
