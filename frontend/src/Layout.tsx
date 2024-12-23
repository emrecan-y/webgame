import { useContext, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { UserContext } from "./App";
import Chat from "./components/chat/Chat";

export function Layout() {
  const { userNickName } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (userNickName === "") {
      navigate("/");
    } else {
      navigate("/lobbies");
    }
  }, [userNickName]);

  return (
    <>
      <div className="flex justify-center min-h-screen items-center">
        <Outlet />
      </div>
      {userNickName !== "" && <Chat />}
    </>
  );
}
