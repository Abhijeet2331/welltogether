"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Box,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

export default function HappyChatPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]); // Array of { id, sender, text }
  const [loading, setLoading] = useState(false);
  const [typingMessage, setTypingMessage] = useState({ isTyping: false, text: "", fullText: "", id: null });
  const messagesEndRef = useRef(null);

  // Auto-scroll to the bottom whenever messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingMessage]);

  // Typing effect for bot messages
  useEffect(() => {
    if (typingMessage.isTyping && typingMessage.text.length < typingMessage.fullText.length) {
      const timer = setTimeout(() => {
        setTypingMessage(prev => ({
          ...prev,
          text: prev.fullText.substring(0, prev.text.length + 1)
        }));
      }, 20); // Speed of typing
      return () => clearTimeout(timer);
    } else if (typingMessage.isTyping && typingMessage.text.length === typingMessage.fullText.length) {
      // When typing is complete, add the message to the messages array
      setMessages(prev => [...prev, { id: typingMessage.id, sender: "bot", text: typingMessage.fullText }]);
      setTypingMessage({ isTyping: false, text: "", fullText: "", id: null });
    }
  }, [typingMessage]);

  // Format text to place ** content on new lines
  const formatText = (text) => {
    if (!text) return "";
    
    // Split the text by ** and then reconstruct with line breaks
    let parts = [];
    let currentIndex = 0;
    let searchText = text;
    
    while (searchText.indexOf("**") !== -1) {
      const asteriskIndex = searchText.indexOf("**");
      
      if (asteriskIndex > 0) {
        parts.push(searchText.substring(0, asteriskIndex));
      }
      
      const nextAsteriskIndex = searchText.indexOf("**", asteriskIndex + 2);
      
      if (nextAsteriskIndex !== -1) {
        // Found a paired **
        parts.push("\n**" + searchText.substring(asteriskIndex + 2, nextAsteriskIndex) + "**\n");
        searchText = searchText.substring(nextAsteriskIndex + 2);
      } else {
        // Unpaired **, just add it as is
        parts.push("**" + searchText.substring(asteriskIndex + 2));
        break;
      }
    }
    
    // Add any remaining text
    if (searchText) {
      parts.push(searchText);
    }
    
    return parts.join("");
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { id: Date.now(), sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    const prompt = input;
    setInput("");
    setLoading(true);

    try {
      // Make sure this API route matches your actual API route structure
      const res = await fetch("/api/happy-gpt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        console.error("API Error Status:", res.status);
        throw new Error(`API response not OK: ${res.status}`);
      }

      const data = await res.json();
      const formattedText = formatText(data.reply);
      const messageId = Date.now() + 1;
      
      // Start typing effect
      setTypingMessage({
        isTyping: true,
        text: "",
        fullText: formattedText,
        id: messageId
      });
    } catch (error) {
      console.error("Chat API Error:", error);
      const errorMsg = {
        id: Date.now() + 1,
        sender: "bot",
        text: "⚠️ Error connecting to AI. Please try again later.",
      };
      setMessages((prev) => [...prev, errorMsg]);
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5, display: "flex", flexDirection: "column", height: "80vh" }}>
      <Typography variant="h4" fontWeight="bold" textAlign="center" sx={{ mb: 3 }}>
        🤖 Happy Gemma Chat
      </Typography>

      {/* Chat messages container */}
      <Paper
        sx={{
          flex: 1,
          p: 3,
          mb: 2,
          boxShadow: 3,
          overflowY: "auto",
          backgroundColor: "#f9f9f9",
        }}
      >
        {messages.length === 0 && !typingMessage.isTyping && (
          <Typography variant="body2" color="textSecondary" textAlign="center" sx={{ mt: 3 }}>
            Start a conversation with Gemma 3!
          </Typography>
        )}
        
        {messages.map((msg) => (
          <Box key={msg.id} sx={{ mb: 2, textAlign: msg.sender === "user" ? "right" : "left" }}>
            <Typography
              variant="body1"
              sx={{
                display: "inline-block",
                p: 1,
                borderRadius: 2,
                backgroundColor: msg.sender === "user" ? "#e0f7fa" : "#f1f8e9",
                maxWidth: "80%",
                wordBreak: "break-word",
                whiteSpace: "pre-wrap", // Preserves line breaks
              }}
            >
              {msg.text}
            </Typography>
          </Box>
        ))}
        
        {typingMessage.isTyping && (
          <Box sx={{ mb: 2, textAlign: "left" }}>
            <Typography
              variant="body1"
              sx={{
                display: "inline-block",
                p: 1,
                borderRadius: 2,
                backgroundColor: "#f1f8e9",
                maxWidth: "80%",
                wordBreak: "break-word",
                whiteSpace: "pre-wrap", // Preserves line breaks
              }}
            >
              {typingMessage.text}
              <span className="typing-cursor">|</span>
            </Typography>
          </Box>
        )}
        
        <div ref={messagesEndRef} />
      </Paper>

      {/* Input field and Send button */}
      <Box sx={{ display: "flex" }}>
        <TextField
          fullWidth
          placeholder="Type a message..."
          variant="outlined"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          disabled={loading || typingMessage.isTyping}
        />
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleSend} 
          sx={{ ml: 2 }} 
          disabled={loading || typingMessage.isTyping}
        >
          {loading ? <CircularProgress size={24} /> : <SendIcon />}
        </Button>
      </Box>
      
      {/* Add a style tag for the blinking cursor */}
      <style jsx global>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .typing-cursor {
          animation: blink 1s infinite;
        }
      `}</style>
    </Container>
  );
}