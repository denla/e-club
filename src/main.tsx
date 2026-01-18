import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

// styles
import { GlobalStyles } from "./styles/GlobalStyles";
import { theme } from "./styles/theme";
import { ThemeProvider } from "styled-components";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider theme={theme}>
    <GlobalStyles />
    <StrictMode>
      <App />
    </StrictMode>
    ,
  </ThemeProvider>,
);
