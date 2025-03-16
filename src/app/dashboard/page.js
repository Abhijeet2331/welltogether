"use client";
import { Container, Typography, Grid, Button, Paper } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CreateIcon from "@mui/icons-material/Create";
import MovieIcon from "@mui/icons-material/Movie";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  const features = [
    { name: "Call & Chat", icon: <ChatIcon />, route: "/dashboard/chat" },
    { name: "Multiplayer Games", icon: <SportsEsportsIcon />, route: "/dashboard/games" },
    { name: "Happy ChatGPT", icon: <AutoAwesomeIcon />, route: "/dashboard/happy-gpt" },
    { name: "Daily Journal", icon: <CreateIcon />, route: "/dashboard/journal" },
    { name: "Watch Party", icon: <MovieIcon />, route: "/dashboard/watch-party" },
    { name: "Sucsess Stories", icon: <MovieIcon />, route: "/dashboard/stories" },
  ];

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Typography variant="h4" fontWeight="bold" textAlign="center">
        WellTogether Dashboard
      </Typography>
      <Grid container spacing={3} sx={{ mt: 4 }}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Paper
              sx={{
                p: 3,
                textAlign: "center",
                borderRadius: 2,
                cursor: "pointer",
                boxShadow: 3,
                "&:hover": { bgcolor: "primary.light" },
              }}
              onClick={() => router.push(feature.route)}
            >
              {feature.icon}
              <Typography variant="h6" sx={{ mt: 1 }}>
                {feature.name}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
