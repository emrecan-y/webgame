import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { StompSessionProvider } from "react-stomp-hooks";
import { urlBackendPort, urlDomain } from "./api.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <StompSessionProvider url={`ws://${urlDomain}:${urlBackendPort}/session`} onDisconnect={(e) => console.log(e)}>
      <App />
    </StompSessionProvider>
  </StrictMode>
);
