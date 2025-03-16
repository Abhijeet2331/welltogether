"use client";
import React from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Box
} from "@mui/material";

export default function SuccessStoriesPage() {
  // Example stories (replace with dynamic data if needed)
  const stories = [
    {
      title: "Meet Kristine Beard, an Inspire Multiple Myeloma Ambassador",
      date: "March 2, 2024",
      excerpt:
        "Multiple myeloma is a cancer of the plasma cells in bone marrow. Read Kristine Beard’s journey of how she’s thriving with her condition.",
      category: "Chronic disease",
      image: "/images/kristine.jpg"
    },
    {
      title: "Navigating a New Land: How One Patient Became Empowered Through Her Chronic Disease",
      date: "March 10, 2024",
      excerpt:
        "There’s no good way to be diagnosed with a chronic disease. After Katie Ray’s life was turned upside down, she found solace by a neurologist and self‑therapy methods. Learn how she took charge and empowered herself.",
      category: "Chronic disease",
      image: "/images/katie.jpg"
    }
  ];

  return (
    <Container maxWidth="md" sx={{ mt: 5, mb: 5 }}>
      <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom>
        Success Stories
      </Typography>
      <Typography variant="subtitle1" textAlign="center" sx={{ mb: 5 }}>
        Every journey has a story — be inspired, stay strong, and keep moving forward!
      </Typography>

      <Grid container spacing={4}>
        {stories.map((story, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Card
              sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%"
              }}
              elevation={3}
            >
              <CardActionArea>
                {/* If you have a valid image, update the src accordingly */}
                {story.image && (
                  <CardMedia
                    component="img"
                    height="200"
                    image={story.image}
                    alt={story.title}
                    onError={(e) => (e.target.style.display = "none")}
                  />
                )}
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {story.title}
                  </Typography>
                  <Typography
                    variant="caption"
                    display="block"
                    color="text.secondary"
                    gutterBottom
                  >
                    {story.date}
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {story.excerpt}
                  </Typography>
                  <Box
                    sx={{
                      display: "inline-block",
                      backgroundColor: "secondary.light",
                      color: "white",
                      px: 2,
                      py: 0.5,
                      borderRadius: 2
                    }}
                  >
                    <Typography variant="caption">{story.category}</Typography>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
