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
    }, 90);

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
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 0,
        }}
      >
        <source src="/your-video.mp4" type="video/mp4" />
      </video>

      {/* Overlay to improve text readability if needed */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.3)", // Adjust opacity as needed
          zIndex: 1,
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          padding: "12vh 5vw 0",
        }}
      >
        {/* Typing Effect Text */}
        <Typography
          variant="h2"
          fontWeight="bold"
          sx={{
            mb: 5,
            color: "white",
            whiteSpace: "nowrap",
            overflow: "hidden",
            borderRight: "4px solid white",
            paddingRight: "10px",
            fontFamily: "'Nunito', sans-serif",
            textShadow: "2px 2px 4px rgba(0,0,0,0.5)", // Text shadow for better readability
          }}
        >
          {typedText}
        </Typography>

        {/* Input Field */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "rgba(255, 214, 224, 0.85)",
            padding: "12px",
            borderRadius: "40px",
            width: "100%",
            maxWidth: "500px",
            boxShadow: "0px 4px 15px rgba(0,0,0,0.2)",
          }}
        >
          <TextField
            fullWidth
            variant="standard"
            placeholder="Enter a character name to start"
            InputProps={{
              disableUnderline: true,
              style: {
                color: "#5A1A1A",
                fontWeight: "bold",
                fontSize: "18px",
                padding: "5px 15px",
              },
            }}
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ flexGrow: 1, background: "transparent" }}
          />

          <Button
            onClick={handleContinue}
            disabled={loading}
            sx={{
              minWidth: "50px",
              height: "50px",
              borderRadius: "50%",
              backgroundColor: "#000000",
              color: "white",
              ml: 2,
              fontSize: "18px",
              "&:hover": {
                backgroundColor: "#F8D24A",
              },
            }}
          >
            ➝
          </Button>
        </div>
      </div>
    </div>
  );
}