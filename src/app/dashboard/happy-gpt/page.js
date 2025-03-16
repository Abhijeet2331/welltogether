"use client"; // ✅ Ensures this is a Client Component

import { useState } from "react";
import { Container, TextField, Button, Typography, Paper, CircularProgress } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

export default function HappyGPTPage() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChat = async () => {
    if (!message.trim()) return; // ✅ Prevents empty input
    setLoading(true);
    setResponse(""); // ✅ Clear previous response

    try {
      const res = await fetch("/api/happy-gpt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: message }),
      });

      if (!res.ok) {
        throw new Error("API response not OK");
      }

      const data = await res.json();
      setResponse(data.reply);
    } catch (error) {
      console.error("ChatGPT Error:", error);
      setResponse("⚠️ Error connecting to AI. Please try again.");
    }

    setLoading(false);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" fontWeight="bold" textAlign="center">
        🤖 Happy ChatGPT
      </Typography>
      <Paper sx={{ p: 3, mt: 3, boxShadow: 3 }}>
        <TextField
          fullWidth
          label="Ask something..."
          variant="outlined"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button variant="contained" color="primary" fullWidth onClick={handleChat} endIcon={<SendIcon />} disabled={loading}>
          {loading ? <CircularProgress size={24} /> : "Send"}
        </Button>
        {response && <Typography variant="h6" sx={{ mt: 3 }}>{response}</Typography>}
      </Paper>
    </Container>
  );
}
