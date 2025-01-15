import { useContext, useEffect, useState } from "react";
import { useStompClient, useSubscription } from "react-stomp-hooks";
import { Lobby } from "../../models/lobby";
import LobbyCreation from "./LobbyCreation";
import LobbyListEntry from "./LobbyListEntry";
import { UserContext } from "../../App";

function LobbyList() {
  const [lobbyList, setLobbyList] = useState<Lobby[]>([]);
  const [showCreationWindow, setShowCreationWindow] = useState(false);

  const userContext = useContext(UserContext);
  const stompClient = useStompClient();

  // listen to backend for current lobbyId
  useSubscription("/user/queue/lobby/lobby-id", (message) => {
    if (message.body !== "") {
      const newLobbyId = parseInt(message.body);
      if (newLobbyId !== -1) {
        userContext.setUserLobbyId!(parseInt(message.body));
      }
    }
  });

  // listen to backend for current lobbyList from request
  useSubscription("/user/queue/lobby-list", (message) => {
    setLobbyList(JSON.parse(message.body));
  });

  // listen to backend for current lobbyList
  useSubscription("/topic/lobby-list", (message) => {
    setLobbyList(JSON.parse(message.body));
  });

  // request current lobbylist from backend
  useEffect(() => {
    if (stompClient) {
      stompClient.publish({
        destination: "/app/lobby-list",
      });
    }
  }, []);

  function buttonHandler() {
    setShowCreationWindow(!showCreationWindow);
  }

  return (
    <div className="flex flex-col w-96 my-12 items-center">
      {lobbyList?.map((e) => (
        <LobbyListEntry key={`listEntry${e.id}`} lobby={e} />
      ))}

      <button className="bg-game-accent-medium px-2 py-1 mt-2 rounded w-full" onClick={buttonHandler}>
        New Lobby
      </button>

      {showCreationWindow && <LobbyCreation setShowCreationWindow={setShowCreationWindow} />}
    </div>
  );
}

export default LobbyList;
