"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Container, Typography, Grid, Button, Paper, TextField } from "@mui/material";
import { io } from "socket.io-client";
import Peer from "peerjs";

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
  const [call, setCall] = useState(null);
  const localAudioRef = useRef(null);
  const remoteAudioRef = useRef(null);

  // Initialize PeerJS
  useEffect(() => {
    const newPeer = new Peer(undefined, {
      host: "your-app.up.railway.app", // Change this when deploying
      secure: true,
      path: "/peerjs",
    });

    newPeer.on("open", (id) => {
      console.log("🔹 My Peer ID:", id);
      setPeerId(id);
    });

    newPeer.on("call", (incomingCall) => {
      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        localAudioRef.current.srcObject = stream;
        incomingCall.answer(stream);
        incomingCall.on("stream", (remoteStream) => {
          remoteAudioRef.current.srcObject = remoteStream;
        });
      });
    });

    setPeer(newPeer);
  }, []);

  // Listen for messages from server
  useEffect(() => {
    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  const sendMessage = () => {
    if (message.trim() !== "") {
      const chatMessage = { text: message, group: selectedGroup };

      console.log("Sending Message:", chatMessage);

      socket.emit("sendMessage", chatMessage);
      setMessages((prev) => [...prev, chatMessage]);
      setMessage("");
    }
  };

  const startCall = () => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      localAudioRef.current.srcObject = stream;
      const outgoingCall = peer.call(remotePeerId, stream);
      outgoingCall.on("stream", (remoteStream) => {
        remoteAudioRef.current.srcObject = remoteStream;
      });
      setCall(outgoingCall);
    });
  };

  const chatGroups = [
    { id: "general", name: "🗣 General Chat" },
    { id: "disease", name: "🦠 Disease-Based Chat" },
    { id: "psychologist", name: "🧠 Talk to a Psychologist" },
  ];

  return (
    <Container maxWidth="lg" style={{ marginTop: "20px" }}>
      <Typography variant="h4" align="center" gutterBottom>
        🗨️ Chat & Call
      </Typography>

      <Grid container spacing={2}>
        {/* Left Column: Chat Groups */}
        <Grid item xs={3}>
          <Paper style={{ padding: "10px", height: "100%" }}>
            <Typography variant="h6">Chat Groups</Typography>
            {chatGroups.map((group) => (
              <Button
                key={group.id}
                fullWidth
                variant={selectedGroup === group.id ? "contained" : "outlined"}
                color="primary"
                style={{ marginTop: "10px" }}
                onClick={() => setSelectedGroup(group.id)}
              >
                {group.name}
              </Button>
            ))}
          </Paper>
        </Grid>

        {/* Middle Column: Chat Window */}
        <Grid item xs={6}>
          <Paper style={{ padding: "10px", height: "400px", overflowY: "auto" }}>
            <Typography variant="h6">{chatGroups.find(g => g.id === selectedGroup)?.name}</Typography>
            <div style={{ height: "300px", overflowY: "scroll", padding: "10px" }}>
              {messages
                .filter((msg) => msg.group === selectedGroup)
                .map((msg, index) => (
                  <Typography key={index} variant="body1" style={{ marginBottom: "5px" }}>
                    {msg.text}
                  </Typography>
                ))}
            </div>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              style={{ marginTop: "10px" }}
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={sendMessage}
              style={{ marginTop: "10px" }}
            >
              Send
            </Button>
          </Paper>
        </Grid>

        {/* Right Column: 24/7 Voice Call */}
        <Grid item xs={3}>
          <Paper style={{ padding: "10px", height: "100%" }}>
            <Typography variant="h6">🎧 24/7 Voice Call</Typography>
            <Typography variant="body2">Your Peer ID: {peerId}</Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter Peer ID"
              value={remotePeerId}
              onChange={(e) => setRemotePeerId(e.target.value)}
              style={{ marginTop: "10px" }}
            />
            <Button variant="contained" color="success" fullWidth onClick={startCall} style={{ marginTop: "10px" }}>
              Join Call
            </Button>
            <Button variant="outlined" color="error" fullWidth onClick={() => call?.close()} style={{ marginTop: "10px" }}>
              Leave Call
            </Button>
            <audio ref={localAudioRef} autoPlay muted style={{ display: "none" }} />
            <audio ref={remoteAudioRef} autoPlay style={{ display: "none" }} />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
