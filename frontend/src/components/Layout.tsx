import { useContext, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { WebSocketErrorContext } from "./context/WebSocketErrorContext";
import { UserContext } from "./context/UserContext";

export function Layout() {
  const { userNickName } = useContext(UserContext);
  const { webSocketError } = useContext(WebSocketErrorContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (userNickName === "") {
      navigate("/");
    } else {
      navigate("/lobbies");
    }
  }, [userNickName]);

  useEffect(() => {
    if (webSocketError) {
      navigate("/connection-error");
    }
  }, [webSocketError]);

  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-transparent text-game-main-light">
        <Outlet />
      </div>

      <div className="absolute left-0 top-0 -z-50 h-full w-full bg-game-main-dark"></div>
    </>
  );
}
