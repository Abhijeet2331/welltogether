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
  Badge,
  Menu,
  MenuItem,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  LinearProgress
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Groups,
  LocalHospital,
  Celebration,
  Poll as PollIcon,
  Movie as MovieIcon,
  ExpandMore as ExpandMoreIcon,
  Send as SendIcon,
  Mic as MicIcon,
  CallEnd as CallEndIcon
} from "@mui/icons-material";
import HomeIcon from "@mui/icons-material/Home";
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
  backgroundImage: "url('/chat_bg3.png')", // Replace with your image path or URL
  backgroundSize: "cover",
  backgroundPosition: "fill",
  backgroundRepeat: "no-repeat",
}));

const MessageList = styled("div")(({ theme }) => ({
  flex: 1,
  overflowY: "auto",
  padding: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
}));

const MessageBubble = styled(Paper, {
  shouldForwardProp: (prop) => prop !== "isUser"
})(({ theme, isUser }) => ({
  maxWidth: "70%",
  alignSelf: isUser ? "flex-end" : "flex-start",
  padding: theme.spacing(1),
  borderRadius: theme.spacing(2),
  backgroundColor: isUser ? "#e0f7fa" : "#f3e5f5",
}));

// Movie polls data
const moviePolls = [
  {
    id: "feel-good-comedy",
    title: "Feel-Good Comedy Night",
    description: "Which heartwarming comedy should we watch next?",
    options: [
      "The Secret Life of Walter Mitty",
      "Little Miss Sunshine", 
      "School of Rock",
      "The Grand Budapest Hotel"
    ],
    votes: [12, 8, 15, 10]
  },
  {
    id: "feel-good-drama",
    title: "Inspirational Drama",
    description: "Pick your favorite uplifting drama",
    options: [
      "The Pursuit of Happyness",
      "Soul", 
      "The Shawshank Redemption",
      "Hidden Figures"
    ],
    votes: [18, 11, 22, 14]
  },
  {
    id: "feel-good-adventure",
    title: "Adventure Feel-Good",
    description: "Which adventure will lift our spirits?",
    options: [
      "Up",
      "The Princess Bride", 
      "Paddington 2",
      "Inside Out"
    ],
    votes: [9, 16, 13, 17]
  },
  {
    id: "feel-good-classics",
    title: "Classic Feel-Good Movies",
    description: "Which timeless classic should we enjoy together?",
    options: [
      "It's a Wonderful Life",
      "Forrest Gump", 
      "Amélie",
      "Singin' in the Rain"
    ],
    votes: [11, 25, 7, 14]
  }
];

// ------------------ VoiceCall Component ------------------
function VoiceCall({ user }) {
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

  const configuration = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };

  const joinCall = async () => {
    try {
      await setUserVoiceStatus(user.id, true);
      setInCall(true);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setLocalStream(stream);
      const pc = new RTCPeerConnection(configuration);
      setPeerConnection(pc);
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      const remoteStream = new MediaStream();
      if (audioRef.current) {
        audioRef.current.srcObject = remoteStream;
      }
      pc.ontrack = (event) => {
        event.streams[0].getTracks().forEach((track) => remoteStream.addTrack(track));
      };

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

// ---------------- MoviePollComponent ----------------
function MoviePoll({ poll, onVote, user }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleVote = () => {
    if (selectedOption !== null) {
      onVote(poll.id, parseInt(selectedOption));
      setHasVoted(true);
    }
  };

  const totalVotes = poll.votes.reduce((sum, count) => sum + count, 0);

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <MovieIcon sx={{ mr: 1, color: '#ab47bc' }} />
        <Typography variant="h6">{poll.title}</Typography>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {poll.description}
      </Typography>

      {!hasVoted ? (
        <FormControl component="fieldset" sx={{ width: '100%' }}>
          <RadioGroup value={selectedOption} onChange={handleChange}>
            {poll.options.map((option, index) => (
              <FormControlLabel
                key={index}
                value={index.toString()}
                control={<Radio color="secondary" />}
                label={option}
              />
            ))}
          </RadioGroup>
          <Button
            variant="contained"
            onClick={handleVote}
            disabled={selectedOption === null || !user}
            sx={{ mt: 1, bgcolor: '#ab47bc' }}
          >
            Vote
          </Button>
          {!user && (
            <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
              Login required to vote
            </Typography>
          )}
        </FormControl>
      ) : (
        <Box>
          {poll.options.map((option, index) => (
            <Box key={index} sx={{ mb: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2">{option}</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {Math.round((poll.votes[index] / totalVotes) * 100)}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={(poll.votes[index] / totalVotes) * 100}
                sx={{ 
                  height: 8, 
                  borderRadius: 1,
                  bgcolor: '#e0e0e0',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: '#ab47bc'
                  }
                }}
              />
              <Typography variant="caption" color="text.secondary">
                {poll.votes[index]} votes
              </Typography>
            </Box>
          ))}
          <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
            Thank you for voting! Total votes: {totalVotes}
          </Typography>
        </Box>
      )}
    </Paper>
  );
}

export default function ChatCallPage() {
  const router = useRouter();
  const [activeGroup, setActiveGroup] = useState("The Commons");
  const [activeSubGroup, setActiveSubGroup] = useState(null);
  const [thriveMenuAnchor, setThriveMenuAnchor] = useState(null);
  const [localPolls, setLocalPolls] = useState(moviePolls);

  const handleVote = (pollId, optionIndex) => {
    setLocalPolls(polls => polls.map(poll => {
      if(poll.id === pollId) {
        const newVotes = [...poll.votes];
        newVotes[optionIndex] = newVotes[optionIndex] + 1;
        return { ...poll, votes: newVotes };
      }
      return poll;
    }));
  };

  const groups = [
    { label: "The Commons", icon: <Groups />, hasSubMenu: false },
    { label: "Thrive Together", icon: <LocalHospital />, hasSubMenu: true },
    { label: "Guided Support", icon: <Celebration />, hasSubMenu: false },
    { label: "Watch Party Polls", icon: <PollIcon />, hasSubMenu: false },
  ];
  
  const diseaseGroups = [
    "Bone Health & Osteoporosis",
    "Lupus",
    "Lung Cancer Survivors",
    "Liver Disease",
    "Prostate Cancer"
  ];

  const handleThriveMenuOpen = (event) => {
    setThriveMenuAnchor(event.currentTarget);
  };

  const handleThriveMenuClose = () => {
    setThriveMenuAnchor(null);
  };

  const handleThriveSubMenuSelect = (subGroup) => {
    setActiveGroup("Thrive Together");
    setActiveSubGroup(subGroup);
    handleThriveMenuClose();
  };

  // Chat messages and input
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");

  // Active voice users (for display)
  const [voiceUsers, setVoiceUsers] = useState([]);
  
  // Current user from localStorage
  const [user, setUser] = useState(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      if (parsed.id) {
        setUser(parsed);
      } else if (parsed.name) {
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
    let chatGroup = activeGroup;
    if (activeSubGroup && activeGroup === "Thrive Together") {
      chatGroup = `${activeGroup}-${activeSubGroup}`;
    }
    
    const unsubscribe = subscribeToChatMessages(chatGroup, (msgs) => {
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
  }, [activeGroup, activeSubGroup]);

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
      let chatGroup = activeGroup;
      if (activeSubGroup && activeGroup === "Thrive Together") {
        chatGroup = `${activeGroup}-${activeSubGroup}`;
      }
      await sendChatMessage(chatGroup, newMsg);
    } catch (err) {
      console.error("Failed to send chat message:", err);
    }
  };

  const getDisplayGroupName = () => {
    if (activeGroup === "Thrive Together" && activeSubGroup) {
      return `${activeGroup}: ${activeSubGroup}`;
    }
    return activeGroup;
  };

  const renderContent = () => {
    if (activeGroup === "Watch Party Polls") {
      return (
        <Box sx={{ p: 2, overflowY: "auto" }}>
          <Typography variant="h5" sx={{ mb: 3 }}>
            Movie Night Polls
          </Typography>
          {localPolls.map((poll) => (
            <MoviePoll key={poll.id} poll={poll} onVote={handleVote} user={user} />
          ))}
        </Box>
      );
    } else {
      return (
        <ChatContainer>
          <MessageList>
            {messages.map((msg) => (
              <MessageBubble 
                key={msg.id} 
                isUser={msg.sender === user?.name || msg.sender === "You"}
                elevation={1}
              >
                <Typography variant="caption" color="text.secondary">
                  {msg.sender}
                </Typography>
                <Typography variant="body1">{msg.text}</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", textAlign: "right" }}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Typography>
              </MessageBubble>
            ))}
          </MessageList>
          <Box 
            sx={{ 
              p: 2, 
              display: "flex", 
              backgroundColor: "#fff", 
              borderTop: "1px solid #e0e0e0" 
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type a message..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              size="small"
              sx={{ mr: 1 }}
              disabled={!user}
            />
            <Button 
              variant="contained" 
              color="primary" 
              endIcon={<SendIcon />} 
              onClick={handleSendMessage}
              disabled={!user}
              sx={{ bgcolor: "#ab47bc" }}
            >
              Send
            </Button>
          </Box>
        </ChatContainer>
      );
    }
  };
  
  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <CssBaseline />
      {/* Updated Header: similar to Games page */}
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100%  - ${voiceDrawerWidth}px)`,
          ml: `${drawerWidth}px`,
          backgroundColor: "#f5f5f5",
          borderBottom: "1px solid #ccc",
          boxShadow: "none"
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", alignItems: "center" }}>
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                color: "#70342B",
                display: "flex",
                alignItems: "center",
              }}
            >
              {getDisplayGroupName()}
            </Typography>
            <Typography variant="subtitle1" sx={{ mt: 1, color: "black" }}>
              Your Chat & Call Hub
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              sx={{
                color: "#70342B",
                border: "1px solid #70342B",
                borderRadius: 2,
                "&:hover": { backgroundColor: "#F8D24A" },
              }}
              onClick={() => router.push("/dashboard")}
            >
              <HomeIcon />
            </IconButton>
            {user && (
              <Box sx={{ ml: 2, display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ mr: 1 }}>
                  {user.name}
                </Typography>
                <Avatar sx={{ bgcolor: "#7b1fa2" }}>
                  {user.name && user.name.charAt(0).toUpperCase()}
                </Avatar>
              </Box>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      
      {/* Left Drawer - Group Navigation */}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <Divider />
        <List>
          {groups.map((group) => (
            <ListItemButton
              key={group.label}
              selected={activeGroup === group.label}
              onClick={
                group.hasSubMenu
                  ? handleThriveMenuOpen
                  : () => {
                      setActiveGroup(group.label);
                      setActiveSubGroup(null);
                    }
              }
            >
              <ListItemIcon sx={{ color: "#9c27b0" }}>{group.icon}</ListItemIcon>
              <ListItemText primary={group.label} />
              {group.hasSubMenu && <ExpandMoreIcon />}
            </ListItemButton>
          ))}
        </List>
        <Menu
          anchorEl={thriveMenuAnchor}
          open={Boolean(thriveMenuAnchor)}
          onClose={handleThriveMenuClose}
        >
          {diseaseGroups.map((group) => (
            <MenuItem
              key={group}
              onClick={() => handleThriveSubMenuSelect(group)}
            >
              {group}
            </MenuItem>
          ))}
        </Menu>
      </Drawer>
      
      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 0,
          width: `calc(100% - ${drawerWidth}px - ${voiceDrawerWidth}px)`,
          height: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Toolbar />
        {renderContent()}
      </Box>
      
      {/* Right Drawer - Voice Users */}
      <Drawer
        variant="permanent"
        anchor="right"
        sx={{
          width: voiceDrawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: voiceDrawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <Typography variant="h6" sx={{ p: 2 }}>
          Voice Channel
        </Typography>
        <Divider />
        <List>
          {voiceUsers.length > 0 ? (
            voiceUsers.map((voiceUser) => (
              <ListItemButton key={voiceUser.id}>
                <ListItemIcon>
                  <Badge color="success" variant="dot">
                    <Avatar sx={{ bgcolor: "#7b1fa2" }}>
                      {voiceUser.name && voiceUser.name.charAt(0).toUpperCase()}
                    </Avatar>
                  </Badge>
                </ListItemIcon>
                <ListItemText primary={voiceUser.name || "Guest"} />
              </ListItemButton>
            ))
          ) : (
            <Typography variant="body2" sx={{ p: 2, color: "text.secondary" }}>
              No one is in the voice channel
            </Typography>
          )}
        </List>
        <Divider />
        <Box sx={{ p: 2 }}>
          <VoiceCall user={user} />
        </Box>
      </Drawer>
    </Box>
  );
}
