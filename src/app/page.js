"use client";

import { Container, Typography, TextField, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [typedText, setTypedText] = useState(""); // Typing effect state
  const fullText = "Welcome to WellTogether!"; // Full text

  // Typing effect logic
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i <= fullText.length) { // Fix "r" not showing by including <=
        setTypedText(fullText.slice(0, i)); // Use slice instead of appending
        i++;
      } else {
        clearInterval(interval);
      }
    }, 90); // Faster typing speed

    return () => clearInterval(interval);
  }, []);

  const handleContinue = async () => {
    if (!name.trim()) return;
    setLoading(true);
    try {
      localStorage.setItem("user", JSON.stringify({ name }));
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to get or create user:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        top: 0,
        left: 0,
        backgroundImage: "url('/your-background.png')", // Full-screen background
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "20px",
      }}
    >
      {/* Typing Effect Text */}
      <Typography
        variant="h2" // Increased size
        fontWeight="bold"
        sx={{
          mb: 3,
          color: "white",
          whiteSpace: "nowrap",
          overflow: "hidden",
          borderRight: "4px solid white", // Blinking cursor
          paddingRight: "10px",
          fontFamily: "'Nunito', sans-serif",
        }}
      >
        {typedText}
      </Typography>

      {/* Input Field */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          background: "#FFD6E0", // Soft pink background
          padding: "14px",
          borderRadius: "40px", // More rounded
          width: "100%",
          maxWidth: "600px", // Increased size
          boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
        }}
      >
        <TextField
          fullWidth
          variant="standard"
          placeholder="Enter a character name to start your journey:"
          InputProps={{
            disableUnderline: true,
            style: {
              color: "#5A1A1A", // Dark reddish-brown text
              fontWeight: "bold",
              fontSize: "18px", // Increased font size
              padding: "5px 15px",
            },
          }}
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ flexGrow: 1, background: "transparent" }}
        />

        {/* Arrow Button */}
        <Button
          onClick={handleContinue}
          disabled={loading}
          sx={{
            minWidth: "55px",
            height: "55px",
            borderRadius: "50%",
            backgroundColor: "#000000", // Black button
            color: "white",
            ml: 2,
            fontSize: "20px",
            "&:hover": {
              backgroundColor: "#F8D24A", // Yellow hover effect
            },
          }}
        >
          ➝
        </Button>
      </div>
    </div>
  );
}
