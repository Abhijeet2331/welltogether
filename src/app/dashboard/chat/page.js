"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Container, Typography, Grid, Button, Paper, TextField, Avatar } from "@mui/material";
import { io } from "socket.io-client";
import Peer from "peerjs";
import SendIcon from "@mui/icons-material/Send";
import CallIcon from "@mui/icons-material/Call";
import PhoneCallbackIcon from "@mui/icons-material/PhoneCallback";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Howl } from "howler";

// Connect to the Socket.io server
const socket = io("http://localhost:3001");

export default function ChatPage() {
  const router = useRouter();
  const [selectedGroup, setSelectedGroup] = useState("general");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [peerId, setPeerId] = useState(null);
  const [remotePeerId, setRemotePeerId] = useState("");
  const [peer, setPeer] = useState(null);
  const localAudioRef = useRef(null);
  const remoteAudioRef = useRef(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  // Restore Chat Groups
  const chatGroups = [
    { id: "general", name: "🗣 General Chat" },
    { id: "disease", name: "🦠 Disease-Based Chat" },
    { id: "psychologist", name: "🧠 Talk to a Psychologist" },
  ];

  useEffect(() => {
    if (!chatGroups.find((g) => g.id === selectedGroup)) {
      setSelectedGroup("general"); // Default to general chat if invalid group
    }
  }, [selectedGroup]);

  // Initialize PeerJS for voice call
  useEffect(() => {
    const newPeer = new Peer({
      host: "peerjs-server.herokuapp.com", // More stable PeerJS server
      secure: true,
      port: 443,
    });

    newPeer.on("open", (id) => {
      console.log("✅ PeerJS Connected! My ID:", id);
      setPeerId(id);
      socket.emit("userConnected", { id, name: `User ${id.slice(-4)}` });
    });

    newPeer.on("error", (err) => {
      console.error("❌ PeerJS Error:", err);
      toast.error("Error initializing PeerJS. Try refreshing!");
    });

    newPeer.on("call", (incomingCall) => {
      console.log("📞 Incoming call from:", incomingCall.peer);
      const ringtone = new Howl({
        src: ["/ringtone.mp3"],
        autoplay: true,
        loop: true,
      });

      toast.info(
        <div>
          <Typography variant="h6">📞 Incoming Call...</Typography>
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              ringtone.stop();
              acceptCall(incomingCall);
            }}
          >
            <PhoneCallbackIcon /> Accept
          </Button>
        </div>,
        { autoClose: false, position: "top-right" }
      );
    });

    setPeer(newPeer);
  }, []);

  // Listen for messages from server
  useEffect(() => {
    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("updateUsers", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("updateUsers");
    };
  }, []);

  const sendMessage = () => {
    if (message.trim() !== "") {
      const chatMessage = {
        text: message,
        group: selectedGroup,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      socket.emit("sendMessage", chatMessage);
      setMessages((prev) => [...prev, chatMessage]);
      setMessage("");
    }
  };

  // 📞 Start a voice call
  const startCall = () => {
    if (!remotePeerId) {
      toast.error("❌ Enter a valid Peer ID!");
      return;
    }

    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      localAudioRef.current.srcObject = stream;
      const outgoingCall = peer.call(remotePeerId, stream);
      outgoingCall.on("stream", (remoteStream) => {
        remoteAudioRef.current.srcObject = remoteStream;
      });
    });
  };

  // 📞 Accept an incoming call
  const acceptCall = (incomingCall) => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      localAudioRef.current.srcObject = stream;
      incomingCall.answer(stream);
      incomingCall.on("stream", (remoteStream) => {
        remoteAudioRef.current.srcObject = remoteStream;
      });
    });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <Typography variant="h4" align="center" gutterBottom>
        🗨️ Chat & Voice Call
      </Typography>

      <Grid container spacing={2}>
        {/* Left Column: Chat Groups */}
        <Grid item xs={3}>
          <Paper sx={{ p: 2, height: "100%" }}>
            <Typography variant="h6">Chat Groups</Typography>
            {chatGroups.map((group) => (
              <Button
                key={group.id}
                fullWidth
                variant={selectedGroup === group.id ? "contained" : "outlined"}
                color="primary"
                sx={{ mt: 1 }}
                onClick={() => setSelectedGroup(group.id)}
              >
                {group.name}
              </Button>
            ))}
          </Paper>
        </Grid>

        {/* Middle Column: Chat Window */}
        <Grid item xs={6}>
          <Paper sx={{ p: 2, height: "450px", display: "flex", flexDirection: "column", overflowY: "auto" }}>
            <Typography variant="h6">{chatGroups.find(g => g.id === selectedGroup)?.name}</Typography>

            {/* Chat Messages */}
            <div style={{ flex: 1, overflowY: "scroll", padding: "10px" }}>
              {messages.length === 0 ? (
                <Typography variant="body2" color="textSecondary" align="center">
                  No messages yet. Start the conversation!
                </Typography>
              ) : (
                messages.filter((msg) => msg.group === selectedGroup).map((msg, index) => (
                  <div key={index} style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                    <Avatar sx={{ mr: 1, bgcolor: "#3f51b5" }}>{msg.text[0]}</Avatar>
                    <Paper sx={{ p: 1.5, bgcolor: "#e0f7fa", borderRadius: 2 }}>
                      <Typography variant="body1">{msg.text}</Typography>
                      <Typography variant="caption" color="textSecondary">{msg.time}</Typography>
                    </Paper>
                  </div>
                ))
              )}
            </div>
          </Paper>
        </Grid>

        {/* Right Column: Voice Call */}
        <Grid item xs={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">🎧 Voice Call</Typography>
            <Typography>Your ID: <strong>{peerId ? peerId : "Generating..."}</strong></Typography>
            <TextField label="Enter Peer ID" variant="outlined" fullWidth sx={{ mt: 1 }} value={remotePeerId} onChange={(e) => setRemotePeerId(e.target.value)} />
            <Button variant="contained" color="primary" sx={{ mt: 1 }} onClick={startCall}>
              <CallIcon /> Call
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
