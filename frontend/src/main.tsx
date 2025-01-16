import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { WebSocketErrorProvider } from "./components/context/WebSocketErrorContext";
import StompSession from "./components/StompSession";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <WebSocketErrorProvider>
      <StompSession />
    </WebSocketErrorProvider>
  </StrictMode>
);
