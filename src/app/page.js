"use client";

import { Typography, TextField, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [typedText, setTypedText] = useState("");
  const fullText = "Welcome to WellTogether!";

  // Typing effect logic
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i <= fullText.length) {
        setTypedText(fullText.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 70); // Adjust speed as needed

    return () => clearInterval(interval);
  }, []);

  const handleContinue = () => {
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
        position: "relative",
        width: "100%",
        height: "100vh",
        margin: 0,
        padding: 0,
        overflow: "hidden",
        backgroundImage: 'url("/your-background.png")', // Your background image
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Main Content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "15vh", // Move content down from the top
        }}
      >
        {/* Typing Effect Heading */}
        <Typography
          variant="h1"
          fontWeight="bold"
          sx={{
            mb: 5,
            color: "white",
            whiteSpace: "nowrap",
            overflow: "hidden",
            borderRight: "4px solid white",
            paddingRight: "10px",
            fontFamily: "'Nunito', sans-serif",
            textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
          }}
        >
          {typedText}
        </Typography>

        {/* Pink Input Box */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "#FFD6E0",
            padding: "16px",
            borderRadius: "40px",
            width: "100%",
            maxWidth: "600px",
            boxShadow: "0px 4px 15px rgba(0,0,0,0.2)",
            marginBottom: "5vh",
          }}
        >
          <TextField
            fullWidth
            variant="standard"
            placeholder="Enter a character name to start your journey:"
            InputProps={{
              disableUnderline: true,
              style: {
                color: "#5A1A1A",
                fontWeight: "bold",
                fontSize: "20px",
                padding: "5px 15px",
              },
            }}
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ background: "transparent" }}
          />

          <Button
            onClick={handleContinue}
            disabled={loading}
            sx={{
              minWidth: "55px",
              height: "55px",
              borderRadius: "50%",
              backgroundColor: "#000000",
              color: "white",
              ml: 2,
              fontSize: "20px",
              "&:hover": {
                backgroundColor: "#F8D24A",
                color: "#000000",
              },
            }}
          >
            ➜
          </Button>
        </div>

        {/* GIF below the box */}
        <div
          style={{
            width: "80%",
            maxWidth: "700px",
            borderRadius: "20px",
            overflow: "hidden",
            // Removed boxShadow for a flatter look
            opacity: 0.9,
            filter: "brightness(0.95) saturate(0.95)",
          }}
        >
          <img
            src="/video.gif"
            alt="Animated"
            style={{
              width: "100%",
              height: "auto",
              display: "block",
              objectFit: "cover",
              objectPosition: "bottom", // Aligns image so the bottom is visible
            }}
          />
        </div>
      </div>
    </div>
  );
}
