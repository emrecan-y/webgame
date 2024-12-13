import { StompSessionProvider } from "react-stomp-hooks";
import Chat from "../chat/Chat";
import LobbyList from "./LobbyList";
import "./LobbyPage.css";
import { urlBackendPort, urlDomain } from "../../api";

function Lobby() {
  return (
    <>
      <div id="lobby-page">
        <StompSessionProvider url={`ws://${urlDomain}:${urlBackendPort}/lobby`}>
          <LobbyList />
        </StompSessionProvider>
        <Chat />
      </div>
    </>
  );
}

export default Lobby;
