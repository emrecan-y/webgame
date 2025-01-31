import { useContext, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { WebSocketErrorContext } from "./context/WebSocketErrorContext";
import { UserContext } from "./context/UserContext";

export function Layout() {
  const { userNickName, setUserNickName } = useContext(UserContext);
  const { webSocketError } = useContext(WebSocketErrorContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (userNickName === "" && !webSocketError) {
      navigate("/");
    } else if (webSocketError) {
      setUserNickName("");
      navigate("/connection-error");
    } else {
      navigate("/lobbies");
    }
  }, [userNickName, webSocketError]);

  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-transparent text-game-main-light">
        <Outlet />
      </div>
    </>
  );
}
