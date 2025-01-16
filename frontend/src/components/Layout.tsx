import { useContext, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Chat from "./chat/Chat";
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
      <div className="flex justify-center min-h-screen items-center">
        <Outlet />
      </div>
      {userNickName !== "" && <Chat />}
    </>
  );
}
