"use client";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../theme";

export default function RootLayout({ children }) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
