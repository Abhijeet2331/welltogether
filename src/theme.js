import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#C4A2F6", // Light purple (background)
    },
    secondary: {
      main: "#FFD6E0", // Soft pink (input field)
    },
    background: {
      default: "#C4A2F6", // Light purple background
    },
    text: {
      primary: "#5A1A1A", // Dark reddish-brown text
      secondary: "#333",  // Secondary gray text
    },
    action: {
      hover: "#F8D24A", // Accent yellow hover color
    },
  },
  typography: {
    fontFamily: "'Nunito', sans-serif",
  },
});

export default theme;
