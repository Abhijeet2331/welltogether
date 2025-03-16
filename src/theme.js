import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#4B9CD3", // Light blue (HelpGuide.org theme)
    },
    secondary: {
      main: "#FF6F61", // Warm coral red
    },
    background: {
      default: "#F7F9FC", // Light grayish blue
    },
    text: {
      primary: "#333", // Dark gray for contrast
      secondary: "#666",
    },
  },
  typography: {
    fontFamily: "'Nunito', sans-serif",
  },
});

export default theme;
