import { StompSessionProvider } from "react-stomp-hooks";
import { backendProtocoll, backendUrl } from "../api";
import App from "./App";
import { useContext } from "react";
import { WebSocketErrorContext } from "./context/WebSocketErrorContext";

function StompSession() {
  const { setWebSocketError } = useContext(WebSocketErrorContext);

  return (
    <StompSessionProvider
      url={`${backendProtocoll}://${backendUrl}/session`}
      onConnect={() => {
        setWebSocketError(false);
      }}
      onWebSocketError={() => {
        setWebSocketError(true);
      }}
    >
      <App />
    </StompSessionProvider>
  );
}

export default StompSession;
