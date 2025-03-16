"use client";
import React, { useState, useEffect, useRef } from "react";
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
  setUserVoiceStatus,
  getOrCreateUser
} from "@/firebaseService";
import { useRouter } from "next/navigation";

// Drawer widths
const drawerWidth = 250;
const voiceDrawerWidth = 250;

// Styled components for chat area
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

// Filter out custom prop "isUser" so it isn't passed to DOM
const MessageBubble = styled(Paper, {
  shouldForwardProp: (prop) => prop !== "isUser"
})(({ theme, isUser }) => ({
  maxWidth: "70%",
  alignSelf: isUser ? "flex-end" : "flex-start",
  padding: theme.spacing(1),
  borderRadius: theme.spacing(2),
  backgroundColor: isUser ? "#e0f7fa" : "#f3e5f5",
}));

// ------------------ VoiceCall Component ------------------
function VoiceCall({ user }) {
  // If no valid user, show disabled button
  if (!user || !user.id) {
    return (
      <Button variant="contained" disabled sx={{ width: "100%" }}>
        Join Voice (Login Required)
      </Button>
    );
  }

  const [inCall, setInCall] = useState(false);
  const [peerConnection, setPeerConnection] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const audioRef = useRef(null);
  const callDocRef = useRef(null);

  // STUN configuration for ICE candidates
  const configuration = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };

  const joinCall = async () => {
    try {
      // Mark user as active in voice channel
      await setUserVoiceStatus(user.id, true);
      setInCall(true);

      // Get local audio stream
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setLocalStream(stream);
      const pc = new RTCPeerConnection(configuration);
      setPeerConnection(pc);
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      // Create remote stream and attach it to audio element
      const remoteStream = new MediaStream();
      if (audioRef.current) {
        audioRef.current.srcObject = remoteStream;
      }
      pc.ontrack = (event) => {
        event.streams[0].getTracks().forEach((track) => remoteStream.addTrack(track));
      };

      // --- Placeholder Signaling Logic ---
      // Use a fixed call document "activeCall" in Firestore.
      // In a full implementation, exchange SDP offers/answers and ICE candidates via Firestore.
      console.log("VoiceCall: RTCPeerConnection created. Signaling exchange is not fully implemented.");
    } catch (err) {
      console.error("Error joining voice call:", err);
    }
  };

  const leaveCall = async () => {
    try {
      await setUserVoiceStatus(user.id, false);
      setInCall(false);
      if (peerConnection) {
        peerConnection.close();
        setPeerConnection(null);
      }
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
        setLocalStream(null);
      }
    } catch (err) {
      console.error("Error leaving voice call:", err);
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      {!inCall ? (
        <Button
          variant="contained"
          startIcon={<MicIcon />}
          onClick={joinCall}
          sx={{ width: "100%", backgroundColor: "#ab47bc" }}
        >
          Join Voice
        </Button>
      ) : (
        <Button
          variant="contained"
          startIcon={<CallEndIcon />}
          color="error"
          onClick={leaveCall}
          sx={{ width: "100%" }}
        >
          Leave Voice
        </Button>
      )}
      <audio ref={audioRef} autoPlay playsInline style={{ display: "none" }} />
    </Box>
  );
}
// ---------------- End VoiceCall Component ----------------

export default function ChatCallPage() {
  const router = useRouter();
  const [activeGroup, setActiveGroup] = useState("General Chat");
  const groups = [
    { label: "General Chat", icon: <Groups /> },
    { label: "Disease Based Chat", icon: <LocalHospital /> },
    { label: "Support Groups", icon: <Celebration /> },
    { label: "Talk to Psychologist", icon: <Psychology /> },
  ];

  // Chat messages and input
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");

  // Active voice users (for display)
  const [voiceUsers, setVoiceUsers] = useState([]);
  
  // Current user from localStorage
  const [user, setUser] = useState(null);

  // Load user from localStorage on mount; if user exists but no id, create one.
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      if (parsed.id) {
        setUser(parsed);
      } else if (parsed.name) {
        // Create a new user with full info
        getOrCreateUser(parsed.name).then((newUser) => {
          localStorage.setItem("user", JSON.stringify(newUser));
          setUser(newUser);
        }).catch(err => console.error("Error creating user:", err));
      } else {
        console.warn("User data invalid in localStorage.");
      }
    } else {
      console.warn("No user found in localStorage.");
    }
  }, []);

  // Subscribe to chat messages for activeGroup using subscribeToChatMessages
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

  // Subscribe to active voice users using subscribeToActiveUsers
  useEffect(() => {
    const unsubscribe = subscribeToActiveUsers((activeUsers) => {
      setVoiceUsers(activeUsers);
    });
    return () => unsubscribe && unsubscribe();
  }, []);

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
        </Box>
      </Drawer>

      {/* Middle Column - Chat Window */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <AppBar
          position="static"
          sx={{
            backgroundColor: "#ce93d8",
            boxShadow: 1,
            height: 64,
            justifyContent: "center",
          }}
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
          <Box sx={{ display: "flex", p: 2, borderTop: "1px solid #ddd" }}>
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
        <Box sx={{ overflowY: "auto", p: 2, height: "calc(100vh - 64px)" }}>
          <Typography variant="h6" textAlign="center">
            Voice Channel
          </Typography>
          <Divider sx={{ my: 1 }} />
          {voiceUsers.length === 0 ? (
            <Typography variant="body2" textAlign="center">
              No users online.
            </Typography>
          ) : (
            voiceUsers.map((u) => (
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
            ))
          )}
          <Divider sx={{ my: 1 }} />
          <VoiceCall user={user} />
        </Box>
      </Drawer>
    </Box>
  );
}
