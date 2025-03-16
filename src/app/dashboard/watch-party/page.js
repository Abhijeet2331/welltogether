"use client";

import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import HomeIcon from "@mui/icons-material/Home";

export default function WatchPartyPage() {
  const router = useRouter();
  // The watch party URL
  const watchPartyURL = "https://www.watchparty.me/watch/ethereal-parcel-shear";

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "white", // Use your own background if needed
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#f5f5f5",
          borderBottom: "1px solid #ccc",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Watch Party
        </Typography>
        <Button
          variant="outlined"
          onClick={() => router.push("/dashboard")}
          startIcon={<HomeIcon />}
          sx={{ fontWeight: "bold" }}
        >
          Back to Menu
        </Button>
      </Box>

      {/* Iframe Container */}
      <Box sx={{ flex: 1 }}>
        <iframe
          src={watchPartyURL}
          title="Watch Party"
          style={{
            width: "100%",
            height: "100%",
            border: "none",
          }}
        />
      </Box>
    </Box>
  );
}
