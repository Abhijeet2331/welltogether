"use client";

import React, { useState, useRef, useEffect } from "react";
import { Typography, TextField, Button, Box, CircularProgress } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

export default function HappyChatPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]); // Array of { id, sender, text }
  const [loading, setLoading] = useState(false);
  const [typingMessage, setTypingMessage] = useState({
    isTyping: false,
    text: "",
    fullText: "",
    id: null,
  });
  const messagesEndRef = useRef(null);

  // Auto-scroll to the bottom whenever messages or typing updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingMessage]);

  // Typing effect for bot messages
  useEffect(() => {
    if (typingMessage.isTyping && typingMessage.text.length < typingMessage.fullText.length) {
      const timer = setTimeout(() => {
        setTypingMessage((prev) => ({
          ...prev,
          text: prev.fullText.substring(0, prev.text.length + 1),
        }));
      }, 20); // Speed of typing
      return () => clearTimeout(timer);
    } else if (
      typingMessage.isTyping &&
      typingMessage.text.length === typingMessage.fullText.length
    ) {
      // Typing is complete; add the message to the array
      setMessages((prev) => [
        ...prev,
        { id: typingMessage.id, sender: "bot", text: typingMessage.fullText },
      ]);
      setTypingMessage({ isTyping: false, text: "", fullText: "", id: null });
    }
  }, [typingMessage]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { id: Date.now(), sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/happy-gpt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userMessage.text }),
      });

      if (!res.ok) {
        console.error("API Error Status:", res.status);
        throw new Error(`API response not OK: ${res.status}`);
      }

      const data = await res.json();
      const messageId = Date.now() + 1;

      // Start typing effect
      setTypingMessage({
        isTyping: true,
        text: "",
        fullText: data.reply, // If you want to format text, do so here
        id: messageId,
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
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        margin: 0,
        padding: 0,
        overflow: "hidden",
        backgroundImage: 'url("/happygptb.png")', // Replace with your background
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Centered Heading Section */}
      <Box
        sx={{
          flex: "0 0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          pt: 8, // Move down from top
        }}
      >
        <Typography variant="h2" sx={{ fontWeight: "bold", mb: 1 }}>
          Happy Bot
        </Typography>
        <Typography variant="h4" sx={{ mb: 4 }}>
          Your virtual cheerleader is here — talk to Happy Bot 💛
        </Typography>
      </Box>

      {/* Chat Window (transparent) */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pt: 2,
          pb: 2,
        }}
      >
        <Box
          sx={{
            width: "60%", // 60% wide
            flex: 1,
            overflowY: "auto",
            backgroundColor: "transparent", // Transparent so background shows
            display: "flex",
            flexDirection: "column",
          }}
        >
         

          {/* Render messages */}
          {messages.map((msg) => (
            <Box
              key={msg.id}
              sx={{
                mb: 2,
                textAlign: msg.sender === "user" ? "right" : "left",
              }}
            >
              <Box
                sx={{
                  display: "inline-block",
                  p: 1,
                  borderRadius: 2,
                  backgroundColor:
                    msg.sender === "user"
                      ? "rgba(224, 247, 250, 0.8)"
                      : "rgba(241, 248, 233, 0.8)",
                  maxWidth: "80%",
                  wordBreak: "break-word",
                  whiteSpace: "pre-wrap",
                }}
              >
                {msg.text}
              </Box>
            </Box>
          ))}

          {/* Bot typing animation */}
          {typingMessage.isTyping && (
            <Box sx={{ mb: 2, textAlign: "left" }}>
              <Box
                sx={{
                  display: "inline-block",
                  p: 1,
                  borderRadius: 2,
                  backgroundColor: "rgba(241, 248, 233, 0.8)",
                  maxWidth: "80%",
                  wordBreak: "break-word",
                  whiteSpace: "pre-wrap",
                }}
              >
                {typingMessage.text}
                <span className="typing-cursor">|</span>
              </Box>
            </Box>
          )}
          <div ref={messagesEndRef} />
        </Box>

        {/* Input Bar at Bottom */}
        <Box
          sx={{
            width: "60%", // 60% wide
            display: "flex",
            alignItems: "center",
            mt: 2,
          }}
        >
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
            sx={{
              backgroundColor: "transparent",
            }}
          />
          <Button
            variant="text"
            onClick={handleSend}
            disabled={loading || typingMessage.isTyping}
            sx={{
              ml: 1,
              color: "#000",
              fontSize: "24px",
              minWidth: "50px",
              "&:hover": {
                backgroundColor: "rgba(0,0,0,0.1)",
              },
            }}
          >
            {loading ? <CircularProgress size={24} /> : <SendIcon />}
          </Button>
        </Box>
      </Box>

      {/* Blinking cursor styling */}
      <style jsx global>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .typing-cursor {
          animation: blink 1s infinite;
        }
      `}</style>
    </Box>
  );
}
 