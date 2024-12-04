import { useEffect, useState } from "react";
import { useSubscription } from "react-stomp-hooks";
import { Lobby } from "../../models/lobby";
import LobbyCreation from "./LobbyCreation";
import LobbyListEntry from "./LobbyListEntry";

function LobbyList() {
  const [lobbyList, setLobbyList] = useState<Lobby[]>([]);
  const [showCreationWindow, setShowCreationWindow] = useState(false);

  useSubscription("/topic/lobby-list", (message) => {
    console.log(message.body);
    setLobbyList(JSON.parse(message.body));
  });
  useEffect(() => {
    fetch("http://localhost:8080/lobby-list").then((response) => {
      response.json().then((e) => setLobbyList(e));
    });
  }, []);

  function buttonHandler() {
    setShowCreationWindow(!showCreationWindow);
  }
  console.log(lobbyList);
  return (
    <div id="lobby-list">
      {lobbyList !== undefined &&
        lobbyList.map((e) => <LobbyListEntry lobby={e} />)}
      {showCreationWindow ? (
        <>
          <LobbyCreation setShowCreationWindow={setShowCreationWindow} />
        </>
      ) : (
        <button onClick={buttonHandler}>+</button>
      )}
    </div>
  );
}

export default LobbyList;
