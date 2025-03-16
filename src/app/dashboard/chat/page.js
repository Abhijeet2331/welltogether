'use client';
// pages/index.js
import React, { useState } from 'react';
import {
  Box,
  CssBaseline,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Paper,
  TextField,
  IconButton,
  Badge,
  ListSubheader,
  Collapse
} from '@mui/material';
import {
  Send as SendIcon,
  Groups as GroupsIcon,
  LocalHospital as MedicalIcon,
  Psychology as PsychologyIcon,
  Celebration as CelebrationIcon,
  ExpandLess,
  ExpandMore,
  Mic,
  MicOff,
  Headset,
  CallEnd,
  Phone
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Styled components
const drawerWidth = 280;
const chatHeaderHeight = 64;
const messageInputHeight = 80;

const ChatContainer = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  height: '100vh',
  overflow: 'auto',
  paddingBottom: messageInputHeight,
  backgroundColor: theme.palette.background.default,
}));

const MessageBubble = styled(Paper)(({ theme, isUser }) => ({
  padding: theme.spacing(1.5),
  marginBottom: theme.spacing(1),
  maxWidth: '80%',
  borderRadius: 16,
  backgroundColor: isUser ? theme.palette.primary.main : theme.palette.background.paper,
  color: isUser ? theme.palette.primary.contrastText : theme.palette.text.primary,
  alignSelf: isUser ? 'flex-end' : 'flex-start',
}));

const VoiceUserBadge = styled(Badge)(({ theme, active }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: active ? theme.palette.success.main : theme.palette.text.disabled,
  },
}));

export default function Home() {
  // State for chat groups and active chat
  const [open, setOpen] = useState({
    general: true,
    disease: false,
    events: false,
    psychology: false
  });
  const [activeChat, setActiveChat] = useState('General Chat');
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, text: 'Welcome to the chat!', sender: 'system', timestamp: new Date() }
  ]);
  const [voiceUsers, setVoiceUsers] = useState([
    { id: 1, name: 'Dr. Smith', active: true, isSpeaking: true },
    { id: 2, name: 'Jane Doe', active: true, isSpeaking: false },
    { id: 3, name: 'John Smith', active: false, isSpeaking: false },
  ]);

  // Toggle chat group collapse
  const handleToggle = (section) => {
    setOpen({
      ...open,
      [section]: !open[section]
    });
  };

  // Handle message send
  const handleSendMessage = () => {
    if (messageInput.trim()) {
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          text: messageInput,
          sender: 'user',
          timestamp: new Date()
        }
      ]);
      setMessageInput('');
      
      // Mock response
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            id: prev.length + 1,
            text: `Response to: ${messageInput}`,
            sender: 'bot',
            timestamp: new Date()
          }
        ]);
      }, 1000);
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            MedChat Platform
          </Typography>
        </Toolbar>
      </AppBar>

      {/* First Column - Chat Groups */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', mt: 2 }}>
          {/* Group 1: General Chats */}
          <List>
            <ListItemButton onClick={() => handleToggle('general')}>
              <ListItemIcon>
                <GroupsIcon />
              </ListItemIcon>
              <ListItemText primary="General Chats" />
              {open.general ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            
            <Collapse in={open.general} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton 
                  sx={{ pl: 4 }} 
                  selected={activeChat === 'General Chat'}
                  onClick={() => setActiveChat('General Chat')}
                >
                  <ListItemText primary="General Chat" />
                  <Badge badgeContent={4} color="error" />
                </ListItemButton>
                <ListItemButton 
                  sx={{ pl: 4 }}
                  selected={activeChat === 'Help Center'}
                  onClick={() => setActiveChat('Help Center')}
                >
                  <ListItemText primary="Help Center" />
                </ListItemButton>
              </List>
            </Collapse>
          </List>
          
          <Divider />
          
          {/* Group 2: Disease Based Chats */}
          <List>
            <ListItemButton onClick={() => handleToggle('disease')}>
              <ListItemIcon>
                <MedicalIcon />
              </ListItemIcon>
              <ListItemText primary="Disease Based" />
              {open.disease ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            
            <Collapse in={open.disease} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton 
                  sx={{ pl: 4 }}
                  selected={activeChat === 'Diabetes'}
                  onClick={() => setActiveChat('Diabetes')}
                >
                  <ListItemText primary="Diabetes" />
                </ListItemButton>
                <ListItemButton 
                  sx={{ pl: 4 }}
                  selected={activeChat === 'Cardiovascular'}
                  onClick={() => setActiveChat('Cardiovascular')}
                >
                  <ListItemText primary="Cardiovascular" />
                </ListItemButton>
                <ListItemButton 
                  sx={{ pl: 4 }}
                  selected={activeChat === 'Mental Health'}
                  onClick={() => setActiveChat('Mental Health')}
                >
                  <ListItemText primary="Mental Health" />
                  <Badge badgeContent={2} color="error" />
                </ListItemButton>
              </List>
            </Collapse>
          </List>
          
          <Divider />
          
          {/* Group 3: Health Events & Community */}
          <List>
            <ListItemButton onClick={() => handleToggle('events')}>
              <ListItemIcon>
                <CelebrationIcon />
              </ListItemIcon>
              <ListItemText primary="Events & Community" />
              {open.events ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            
            <Collapse in={open.events} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton 
                  sx={{ pl: 4 }}
                  selected={activeChat === 'Upcoming Webinars'}
                  onClick={() => setActiveChat('Upcoming Webinars')}
                >
                  <ListItemText primary="Upcoming Webinars" />
                </ListItemButton>
                <ListItemButton 
                  sx={{ pl: 4 }}
                  selected={activeChat === 'Support Groups'}
                  onClick={() => setActiveChat('Support Groups')}
                >
                  <ListItemText primary="Support Groups" />
                </ListItemButton>
                <ListItemButton 
                  sx={{ pl: 4 }}
                  selected={activeChat === 'Wellness Activities'}
                  onClick={() => setActiveChat('Wellness Activities')}
                >
                  <ListItemText primary="Wellness Activities" />
                  <Badge badgeContent={1} color="error" />
                </ListItemButton>
              </List>
            </Collapse>
          </List>
          
          <Divider />
          
          {/* Group 4: Professional Help */}
          <List>
            <ListItemButton onClick={() => handleToggle('psychology')}>
              <ListItemIcon>
                <PsychologyIcon />
              </ListItemIcon>
              <ListItemText primary="Professional Help" />
              {open.psychology ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            
            <Collapse in={open.psychology} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton 
                  sx={{ pl: 4 }}
                  selected={activeChat === 'Talk to Psychologist'}
                  onClick={() => setActiveChat('Talk to Psychologist')}
                >
                  <ListItemText primary="Talk to Psychologist" />
                </ListItemButton>
                <ListItemButton 
                  sx={{ pl: 4 }}
                  selected={activeChat === 'Medical Advice'}
                  onClick={() => setActiveChat('Medical Advice')}
                >
                  <ListItemText primary="Medical Advice" />
                </ListItemButton>
              </List>
            </Collapse>
          </List>
        </Box>
      </Drawer>

      {/* Middle Column - Chat Area */}
      <Box component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <Toolbar />
        
        {/* Chat Header */}
        <Box sx={{
          height: chatHeaderHeight,
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          px: 3,
        }}>
          <Typography variant="h6">{activeChat}</Typography>
        </Box>
        
        {/* Chat Messages */}
        <ChatContainer>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            p: 3, 
            height: `calc(100vh - ${chatHeaderHeight + messageInputHeight + 64}px)`,
            overflowY: 'auto'
          }}>
            {messages.map((message) => (
              <Box
                key={message.id}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: message.sender === 'user' ? 'flex-end' : 'flex-start',
                  mb: 2,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                  {message.sender !== 'user' && (
                    <Avatar
                      sx={{ width: 24, height: 24, mr: 1 }}
                      alt={message.sender}
                      src="/broken-image.jpg"
                    />
                  )}
                  <Typography variant="caption" color="text.secondary">
                    {message.sender === 'user' ? 'You' : message.sender} • {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Typography>
                </Box>
                <MessageBubble isUser={message.sender === 'user'} elevation={1}>
                  <Typography variant="body2">{message.text}</Typography>
                </MessageBubble>
              </Box>
            ))}
          </Box>
        </ChatContainer>
        
        {/* Message Input */}
        <Paper
          elevation={3}
          sx={{
            position: 'fixed',
            bottom: 0,
            left: drawerWidth,
            right: drawerWidth,
            height: messageInputHeight,
            display: 'flex',
            alignItems: 'center',
            p: 2,
            borderTop: 1,
            borderColor: 'divider',
          }}
        >
          <TextField
            fullWidth
            placeholder="Type a message..."
            variant="outlined"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
          />
          <IconButton 
            color="primary" 
            sx={{ ml: 1 }} 
            onClick={handleSendMessage}
            disabled={!messageInput.trim()}
          >
            <SendIcon />
          </IconButton>
        </Paper>
      </Box>

      {/* Third Column - Voice Chat */}
      <Drawer
        variant="permanent"
        anchor="right"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List
            subheader={
              <ListSubheader component="div" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                Voice Channel
                <Box>
                  <IconButton size="small">
                    <Phone fontSize="small" />
                  </IconButton>
                </Box>
              </ListSubheader>
            }
          >
            {voiceUsers.map((user) => (
              <ListItem key={user.id} sx={{ 
                bgcolor: user.isSpeaking ? 'rgba(76, 175, 80, 0.1)' : 'transparent',
                borderRadius: 1,
              }}>
                <ListItemIcon>
                  <VoiceUserBadge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    variant="dot"
                    active={user.active ? 1 : 0}
                  >
                    <Avatar>{user.name.charAt(0)}</Avatar>
                  </VoiceUserBadge>
                </ListItemIcon>
                <ListItemText primary={user.name} />
                {user.active && (
                  <IconButton size="small">
                    {user.isSpeaking ? <Mic fontSize="small" color="success" /> : <MicOff fontSize="small" />}
                  </IconButton>
                )}
              </ListItem>
            ))}
          </List>
          <Divider />
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-around' }}>
            <IconButton color="primary">
              <Mic />
            </IconButton>
            <IconButton color="primary">
              <Headset />
            </IconButton>
            <IconButton color="error">
              <CallEnd />
            </IconButton>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
}
