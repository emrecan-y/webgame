import { useContext, useEffect, useState } from "react";
import { Lobby } from "../../models/lobby";
import { useStompClient, useSubscription } from "react-stomp-hooks";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { GeneralPlayerRequest } from "../../models/requests";
import { AnimatePresence } from "motion/react";
import LobbyListEntryLabel from "./LobbyListEntryLabel";
import MotionButton from "../ui/MotionButton";

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

  function eventListenerAddPlayerToLobby(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
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
    <div
      className={`mb-4 w-full rounded bg-game-accent-light p-1 ${isUserInLobby && "animate-bounce-subtle"}`}
    >
      <div className="my-1 flex h-8 items-center justify-between">
        <p className="pl-1 text-gray-950">Lobby {lobby.id}</p>
        <form className="flex gap-1" onSubmit={eventListenerAddPlayerToLobby}>
          {lobby.isPrivate && !isUserInLobby && (
            <input
              className="mr-2 h-8 w-32 rounded p-2 text-game-main-dark placeholder:text-gray-700"
              type="password"
              name="lobby-password"
              id="lobby-password"
              placeholder="Password"
              onChange={(e) => setPassword(e.currentTarget.value)}
            />
          )}
          {!isUserInLobby && !lobbyIsFull && (
            <MotionButton
              className="rounded bg-game-accent-medium px-2 py-1"
              type="submit"
            >
              Join
            </MotionButton>
          )}
          {isUserInLobby && lobbyIsFull && (
            <MotionButton
              className="rounded bg-game-accent-medium px-2 py-1"
              onClick={startGame}
            >
              {lobby.isGameRunning ? "Rejoin" : "Start Game"}
            </MotionButton>
          )}
        </form>
      </div>

      <div className="rounded bg-game-accent-medium p-1">
        <p className="pl-1">Players</p>
        <div className="bg-game-main-dark pl-1">
          {lobby.users.map((lobbyUser, index) => (
            <AnimatePresence key={`listEntry${lobby.id}-${index}`}>
              <LobbyListEntryLabel lobbyUser={lobbyUser} />
            </AnimatePresence>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LobbyListEntry;
