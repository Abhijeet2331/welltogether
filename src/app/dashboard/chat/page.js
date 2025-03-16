"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Container, Typography, Grid, Button, Paper, TextField, Avatar } from "@mui/material";
import { io } from "socket.io-client";
import Peer from "peerjs";
import SendIcon from "@mui/icons-material/Send";
import CallIcon from "@mui/icons-material/Call";
import PhoneCallbackIcon from "@mui/icons-material/PhoneCallback";
import moment from "moment";
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
  const [call, setCall] = useState(null);
  const localAudioRef = useRef(null);
  const remoteAudioRef = useRef(null);
  const [typing, setTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);

  // Initialize PeerJS
  useEffect(() => {
    const newPeer = new Peer(undefined, {
      host: "peerjs-server.onrender.com", // Change this when deploying
      secure: true,
      path: "/peerjs",
    });

    newPeer.on("open", (id) => {
      console.log("🔹 My Peer ID:", id);
      setPeerId(id);
      socket.emit("userConnected", { id, name: `User ${id.slice(-4)}` });
    });

    newPeer.on("call", (incomingCall) => {
      // Play ringing sound
      const ringtone = new Howl({
        src: ["/ringtone.mp3"],
        autoplay: true,
        loop: true,
      });

      toast.info(
        <div>
          <Typography variant="h6">Incoming Call...</Typography>
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
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) // FIXED
      };
  
      socket.emit("sendMessage", chatMessage);
      setMessages((prev) => [...prev, chatMessage]);
      setMessage("");
    }
  };
  

  const handleTyping = () => {
    setTyping(true);
    setTimeout(() => setTyping(false), 1000);
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
          <Paper style={{ padding: "10px", height: "450px", overflowY: "auto", display: "flex", flexDirection: "column" }}>
            <Typography variant="h6">{chatGroups.find(g => g.id === selectedGroup)?.name}</Typography>

            {/* Chat Messages */}
            <div style={{ flex: 1, overflowY: "scroll", padding: "10px" }}>
              {messages
                .filter((msg) => msg.group === selectedGroup)
                .map((msg, index) => (
                  <div key={index} style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                    <Avatar style={{ marginRight: "10px", backgroundColor: "#3f51b5" }}>{msg.text[0]}</Avatar>
                    <div style={{ backgroundColor: "#e0f7fa", padding: "10px", borderRadius: "10px", maxWidth: "70%" }}>
                      <Typography variant="body1">{msg.text}</Typography>
                      <Typography variant="caption" color="textSecondary">{msg.time}</Typography>
                    </div>
                  </div>
                ))}
            </div>

            {/* Typing Indicator */}
            {typing && <Typography variant="body2" style={{ fontStyle: "italic", color: "gray" }}>Someone is typing...</Typography>}

            {/* Chat Input */}
            <div style={{ display: "flex", alignItems: "center", marginTop: "10px" }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  handleTyping();
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                style={{ marginRight: "10px" }}
              />
              <Button variant="contained" color="primary" onClick={sendMessage}>
                <SendIcon />
              </Button>
            </div>
          </Paper>
        </Grid>

        {/* Right Column: Online Users & Calls */}
        <Grid item xs={3}>
          <Paper style={{ padding: "10px", height: "100%" }}>
            <Typography variant="h6">🎧 Online Users</Typography>
            {onlineUsers.map((user) => (
              <Button key={user.id} fullWidth variant="outlined" color="primary" style={{ marginTop: "10px" }}>
                {user.name} <CallIcon style={{ marginLeft: "10px" }} />
              </Button>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
