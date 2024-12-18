import { StompSessionProvider } from "react-stomp-hooks";
import LobbyList from "./LobbyList";
import { urlBackendPort, urlDomain } from "../../api";

function LobbyPage() {
  return (
    <StompSessionProvider url={`ws://${urlDomain}:${urlBackendPort}/lobby`}>
      <LobbyList />
    </StompSessionProvider>
  );
}

export default LobbyPage;
