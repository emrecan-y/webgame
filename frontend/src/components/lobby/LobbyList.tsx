import { useEffect, useState } from "react";
import { useSubscription } from "react-stomp-hooks";
import { Lobby } from "../../models/lobby";
import LobbyCreation from "./LobbyCreation";
import LobbyListEntry from "./LobbyListEntry";
import { getLobbyList } from "../../api";

function LobbyList() {
  const [lobbyList, setLobbyList] = useState<Lobby[]>([]);
  const [showCreationWindow, setShowCreationWindow] = useState(false);

  useSubscription("/topic/lobby-list", (message) => {
    setLobbyList(JSON.parse(message.body));
  });

  useEffect(() => {
    getLobbyList().then((lobbyList) => setLobbyList(lobbyList));
  }, []);

  function buttonHandler() {
    setShowCreationWindow(!showCreationWindow);
  }

  return (
    <div className="">
      {lobbyList?.map((e) => (
        <LobbyListEntry key={`listEntry${e.id}`} lobby={e} />
      ))}

      {showCreationWindow ? (
        <LobbyCreation setShowCreationWindow={setShowCreationWindow} />
      ) : (
        <button onClick={buttonHandler}>+</button>
      )}
    </div>
  );
}

export default LobbyList;
