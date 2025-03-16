"use client";

import React from "react";
import { Box, Typography, Paper, Link } from "@mui/material";

const articles = [
  {
    timestamp: "3/16/2025 12:47 AM",
    content: "Shared via the Google app",
    link: "https://search.app/HnRTLZeeeKfgwEGP9",
  },
  {
    timestamp: "3/16/2025 12:47 AM",
    content: 'Richina Lukes-Milledge joined "In Focus." Shared via the Google app',
    link: "https://search.app/XpKp2pgWbrRpJNWZ6",
  },
  {
    timestamp: "3/16/2025 12:48 AM",
    content: "Shared via the Google app",
    link: "https://search.app/ijEPhx7Evja79Ets6",
  },
  {
    timestamp: "3/16/2025 12:48 AM",
    content:
      "Fox News war reporter Benjamin Hall opens up about his difficult first year since he was bombed in Ukraine — and how he found the motivation to get home. Source: People.com Shared via the Google app",
    link: "https://search.app/RL1AcW2CyPwo86Ru9",
  },
  {
    timestamp: "3/16/2025 12:49 AM",
    content:
      "Learn how one young mother used her rare chronic lung disease diagnosis to create a community on social media. Shared via the Google app",
    link: "https://search.app/z6h3MzLvxNejAqyC8",
  },
  {
    timestamp: "3/16/2025 12:49 AM",
    content:
      "Today the Charlotte Lozier Institute releases its seventh Stem Cell Research Facts video which returns to the life of lupus survivor Jackie Stollfus and how her… Source: Lozier Institute Shared via the Google app",
    link: "https://search.app/NXdn7N6enisWVqJ98",
  },
];

export default function ArticlesPage() {
  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#f9f9f9",
        p: 4,
        overflowY: "auto", // Enables vertical scrolling when content overflows
      }}
    >
      <Typography variant="h4" sx={{ mb: 4, textAlign: "center" }}>
        Articles
      </Typography>
      {articles.map((article, index) => (
        <Paper key={index} sx={{ p: 2, mb: 2 }}>
          <Typography variant="caption" color="textSecondary">
            [{article.timestamp}]
          </Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            {article.content}{" "}
            <Link
              href={article.link}
              target="_blank"
              rel="noopener"
              underline="hover"
              sx={{ fontWeight: "bold" }}
            >
              {article.link}
            </Link>
          </Typography>
        </Paper>
      ))}
    </Box>
  );
}
