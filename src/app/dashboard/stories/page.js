"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Link
} from "@mui/material";
import { useRouter } from "next/navigation";

const articles = [
  {
    timestamp: "3/16/2025 12:47 AM",
    text: "Kara Vullo, a Honesdale High School teacher and breast cancer survivor...",
    link: "https://search.app/HnRTLZeeeKfgwEGP9",
    image: "/article1.png",
  },
  {
    timestamp: "3/16/2025 12:47 AM",
    text: 'Max De Los Santos, a 77-year-old man, survived a brutal attack by pit bulls...',
    link: "https://search.app/XpKp2pgWbrRpJNWZ6",
    image: "/article2.png",
  },
  {
    timestamp: "3/16/2025 12:48 AM",
    text: "Fox News war reporter Benjamin Hall, who lost a leg and suffered other severe injuries...",
    link: "https://search.app/ijEPhx7Evja79Ets6",
    image: "/article3.png",
  },
  {
    timestamp: "3/16/2025 12:48 AM",
    text: "Gerry, a young mother diagnosed with pulmonary arterial hypertension...",
    link: "https://search.app/RL1AcW2CyPwo86Ru9",
    image: "/article4.png",
  },
  {
    timestamp: "3/16/2025 12:49 AM",
    text: "Lupus survivor Jackie Stollfus underwent an adult stem cell transplant...",
    link: "https://search.app/z6h3MzLvxNejAqyC8",
    image: "/article5.png",
  },
  {
    timestamp: "3/16/2025 12:49 AM",
    text: "Today the Charlotte Lozier Institute releases its seventh Stem Cell Research Facts video...",
    link: "https://search.app/NXdn7N6enisWVqJ98",
    image: "/article6.png",
  },
];

export default function SuccessStoriesPage() {
  const router = useRouter();
  const [selectedArticle, setSelectedArticle] = useState(null);

  const activeArticle = selectedArticle
    ? articles.find((art) => art.link === selectedArticle)
    : null;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100vw",
        minHeight: "100vh",
        margin: 0,
        padding: 0,
        backgroundImage: 'url("/sucessbp.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        overflowY: "auto",
      }}
    >
      {/* Header Section */}
      <Box sx={{ textAlign: "center", pt: 6, pb: 2 }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", color: "#70342B", mb: 1 }}
        >
          Success Stories
          <img
            src="/star.png"
            alt="Star"
            style={{
              width: "30px",
              marginLeft: "8px",
              verticalAlign: "middle",
            }}
          />
        </Typography>
        <Typography variant="h6" sx={{ color: "black" }}>
          Every journey has a story—be inspired, stay strong, and keep moving forward!
        </Typography>
      </Box>

      {/* Grid Container for Articles */}
      <Box sx={{ flex: 1, maxWidth: 1200, mx: "auto", px: 2, pb: 6 }}>
        <Grid
          container
          spacing={4}
          alignItems="stretch" // Ensures equal height in each row
        >
          {articles.map((article, index) => (
            <Grid
              item
              xs={12}
              sm={4}
              md={4}
              key={index}
              sx={{
                display: "flex", // Let the Paper fill the Grid item
              }}
            >
              <Paper
                sx={{
                  p: 2,
                  backgroundColor: "rgba(255,255,255,0.9)",
                  borderRadius: 2,
                  display: "flex",
                  flexDirection: "column",
                  flex: 1, // Fill the height of the Grid item
                }}
              >
                {/* Article Image */}
                <Box
                  sx={{
                    width: "100%",
                    borderRadius: 2,
                    overflow: "hidden",
                    mb: 1,
                  }}
                >
                  <img
                    src={article.image}
                    alt="Article"
                    style={{
                      width: "100%",
                      height: "auto",
                      display: "block",
                      objectFit: "cover",
                    }}
                  />
                </Box>

                {/* Timestamp */}
                <Typography
                  variant="caption"
                  sx={{ display: "block", color: "#666", mb: 1 }}
                >
                  [{article.timestamp}]
                </Typography>

                {/* Article Text and Link */}
                <Typography variant="body1" sx={{ color: "#333", mb: 2 }}>
                  {article.text}{" "}
                  <Link
                    href={article.link}
                    underline="hover"
                    sx={{ fontWeight: "bold", color: "#333" }}
                  >
                    {article.link}
                  </Link>
                </Typography>

                {/* Read More Button (stays at bottom) */}
                <Box sx={{ mt: "auto" }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setSelectedArticle(article.link)}
                  >
                    Read More
                  </Button>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Full-Screen Overlay for Article */}
      {selectedArticle && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "white",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Overlay Header */}
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
              {activeArticle?.text || "Loading..."}
            </Typography>
            <Button
              variant="outlined"
              onClick={() => setSelectedArticle(null)}
              sx={{ fontWeight: "bold" }}
            >
              Back to Menu
            </Button>
          </Box>

          {/* Iframe Container */}
          <Box sx={{ flex: 1 }}>
            <iframe
              src={selectedArticle}
              title="Article Frame"
              style={{
                width: "100%",
                height: "100%",
                border: "none",
              }}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
}
