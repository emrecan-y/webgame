import { useContext, useEffect, useState } from "react";
import { Lobby } from "../../models/lobby";
import { useStompClient, useSubscription } from "react-stomp-hooks";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { PlayerRequest } from "../../models/playerRequest";

type LobbyListEntryProps = {
  lobby: Lobby;
};

function LobbyListEntry({ lobby }: LobbyListEntryProps) {
  const { userNickName, userLobbyId, setLobbyPassWord } = useContext(UserContext);
  const [password, setPassword] = useState<string>("");
  const [lobbyIsFull, setLobbyIsFull] = useState<boolean>(false);

  const stompClient = useStompClient();
  const navigate = useNavigate();

  const isPrivate = lobby.private;
  const isUserInLobby = userLobbyId === lobby.id;

  const request: PlayerRequest = {
    lobbyId: lobby.id,
    nickName: userNickName,
    lobbyPassword: password,
  };

  useEffect(() => {
    setLobbyIsFull(lobby.users.every((name) => name));
  }, [lobby.users]);

  useSubscription("/user/queue/game/start", () => {
    navigate("/game");
  });

  function addPlayerToLobby() {
    if (stompClient) {
      stompClient.publish({
        destination: "/app/lobby/add-player",
        body: JSON.stringify(request),
      });
      setLobbyPassWord(password);
    }
  }

  function startGame() {
    if (stompClient) {
      stompClient.publish({
        destination: "/app/game/start",
        body: JSON.stringify(request),
      });
    }
  }

  return (
    <div className="bg-game-accent-light mb-4 p-1 rounded w-full">
      <div className="flex h-8 justify-between items-center my-1">
        <p className="pl-1 text-gray-950 ">Lobby {lobby.id}</p>
        <div>
          {isPrivate && !isUserInLobby && (
            <>
              <input
                className="w-32 h-8 rounded p-2 mr-2 text-game-main-dark placeholder:text-gray-700"
                type="password"
                name="lobby-password"
                id="lobby-password"
                placeholder="Password"
                onChange={(e) => setPassword(e.currentTarget.value)}
              />
            </>
          )}
          {!isUserInLobby && !lobbyIsFull && (
            <button className="bg-game-accent-medium px-2 py-1 rounded" onClick={addPlayerToLobby}>
              Join
            </button>
          )}
          {isUserInLobby && lobbyIsFull && (
            <button className="bg-game-accent-medium px-2 py-1 rounded" onClick={startGame}>
              Start Game
            </button>
          )}
        </div>
      </div>

      <div className="bg-game-accent-medium  p-1 rounded">
        <p className="pl-1">Players</p>
        <ol>
          {lobby.users.map((lobbyUser, index) => (
            <li className="bg-game-main-dark pl-1 " key={`listEntry${lobby.id}-${index}`}>
              {lobbyUser ? (
                <p className="text-game-main-light">{lobbyUser}</p>
              ) : (
                <p className="text-game-main-medium">Free</p>
              )}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export default LobbyListEntry;
