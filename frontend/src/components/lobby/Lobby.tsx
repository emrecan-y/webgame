import { StompSessionProvider } from "react-stomp-hooks";
import Chat from "../chat/Chat";
import LobbyList from "./LobbyList";
import "./LobbyPage.css";

function Lobby() {
  return (
    <>
      <div id="lobby-page">
        <StompSessionProvider url={"ws://localhost:8080/lobby"}>
          <LobbyList />
        </StompSessionProvider>
        <Chat />
      </div>
    </>
  );
}

export default Lobby;
