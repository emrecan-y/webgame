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
    <div className="flex flex-col w-96">
      {lobbyList?.map((e) => (
        <LobbyListEntry key={`listEntry${e.id}`} lobby={e} />
      ))}

      {showCreationWindow ? (
        <LobbyCreation setShowCreationWindow={setShowCreationWindow} />
      ) : (
        <button className="bg-violet-800 px-2 py-1 mt-2 rounded" onClick={buttonHandler}>
          Create New
        </button>
      )}
    </div>
  );
}

export default LobbyList;
