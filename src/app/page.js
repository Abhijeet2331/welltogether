"use client";

import { Typography, TextField, Button, Fade } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { keyframes } from "@mui/system";

const blink = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0; }
  100% { opacity: 1; }
`;

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
      }}
    >
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: -1,
        }}
      >
        <source src="/back2.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Main Content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          height: "100vh",
          padding: "15vh 20px 0",
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
            paddingRight: "10px",
            fontFamily: "'Nunito', sans-serif",
            textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
            position: "relative",
            // Pseudo-element for blinking cursor
            "::after": {
              content: '""',
              position: "absolute",
              right: 0,
              top: 0,
              bottom: 0,
              borderRight: "4px solid white",
              animation: `${blink} 1s step-start infinite`,
            },
          }}
        >
          {typedText}
        </Typography>

        {/* Fade in transition for the input box */}
        <Fade in={typedText === fullText} timeout={1000}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "#FFD6E0",
              padding: "16px",
              borderRadius: "40px",
              width: "100%",
              maxWidth: "800px",
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
                  fontSize: "30px",
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
        </Fade>
      </div>
    </div>
  );
}
