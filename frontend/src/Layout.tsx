import { useContext, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { UserContext } from "./App";
import Chat from "./components/chat/Chat";

export function Layout() {
  const userContext = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (userContext.userNickName === "") {
      navigate("/");
    } else {
      navigate("/lobbies");
    }
  }, [userContext.userNickName]);

  return (
    <>
      <div className="flex justify-center min-h-full items-center">
        <Outlet />
      </div>
      <Chat />
    </>
  );
}
