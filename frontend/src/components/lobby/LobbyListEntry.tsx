import { useContext, useEffect, useState } from "react";
import { Lobby } from "../../models/lobby";
import { useStompClient, useSubscription } from "react-stomp-hooks";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { GeneralPlayerRequest } from "../../models/requests";

type LobbyListEntryProps = {
  lobby: Lobby;
};

function LobbyListEntry({ lobby }: LobbyListEntryProps) {
  const { userNickName, userLobbyId, setLobbyPassWord } =
    useContext(UserContext);
  const [password, setPassword] = useState<string>("");
  const [lobbyIsFull, setLobbyIsFull] = useState<boolean>(false);

  const stompClient = useStompClient();
  const navigate = useNavigate();

  const isPrivate = lobby.private;
  const isUserInLobby = userLobbyId === lobby.id;

  const request: GeneralPlayerRequest = {
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
    <div className="mb-4 w-full rounded bg-game-accent-light p-1">
      <div className="my-1 flex h-8 items-center justify-between">
        <p className="pl-1 text-gray-950">Lobby {lobby.id}</p>
        <div>
          {isPrivate && !isUserInLobby && (
            <>
              <input
                className="mr-2 h-8 w-32 rounded p-2 text-game-main-dark placeholder:text-gray-700"
                type="password"
                name="lobby-password"
                id="lobby-password"
                placeholder="Password"
                onChange={(e) => setPassword(e.currentTarget.value)}
              />
            </>
          )}
          {!isUserInLobby && !lobbyIsFull && (
            <button
              className="rounded bg-game-accent-medium px-2 py-1"
              onClick={addPlayerToLobby}
            >
              Join
            </button>
          )}
          {isUserInLobby && lobbyIsFull && (
            <button
              className="rounded bg-game-accent-medium px-2 py-1"
              onClick={startGame}
            >
              Start Game
            </button>
          )}
        </div>
      </div>

      <div className="rounded bg-game-accent-medium p-1">
        <p className="pl-1">Players</p>
        <ol>
          {lobby.users.map((lobbyUser, index) => (
            <li
              className="bg-game-main-dark pl-1"
              key={`listEntry${lobby.id}-${index}`}
            >
              {lobbyUser ? (
                lobbyUser === userNickName ? (
                  <p className="text-game-accent-light">{lobbyUser}</p>
                ) : (
                  <p className="text-game-main-light">{lobbyUser}</p>
                )
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
