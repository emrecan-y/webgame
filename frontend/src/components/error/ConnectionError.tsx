import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { WebSocketErrorContext } from "../context/WebSocketErrorContext";

function ConnectionError() {
  const { webSocketError } = useContext(WebSocketErrorContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!webSocketError) {
      navigate("/");
    }
  }, [webSocketError]);

  return (
    <div className="flex h-dvh w-screen items-center justify-center">
      <div className="animate-bounce rounded bg-game-accent-medium p-3 text-center text-game-main-light">
        <h1>The connection to the server is faulty.</h1>

        <div className="mt-1 flex items-center justify-center gap-1">
          <h1> Please wait</h1>
          <span className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-game-accent-light border-b-transparent"></span>
        </div>
      </div>
    </div>
  );
}

export default ConnectionError;
