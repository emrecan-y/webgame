import { useContext, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { WebSocketErrorContext } from "./context/WebSocketErrorContext";
import { UserContext } from "./context/UserContext";
import Chat from "./chat/Chat";
import { InfoPopUpContainer } from "./landing/InfoPopUp";
import { useSubscription } from "react-stomp-hooks";

export function Layout() {
  const { userNickName, resetUserContext } = useContext(UserContext);
  const { webSocketError } = useContext(WebSocketErrorContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (userNickName === "" && !webSocketError) {
      navigate("/");
    } else if (webSocketError) {
      resetUserContext();
      navigate("/connection-error");
    } else {
      navigate("/lobbies");
    }
  }, [userNickName, webSocketError]);

  useSubscription("/user/queue/reset", () => {
    resetUserContext();
  });

  return (
    <>
      <div className="flex min-h-dvh items-center justify-center bg-transparent text-game-main-light">
        <Outlet />
      </div>
      <Chat />
      <InfoPopUpContainer />
    </>
  );
}
