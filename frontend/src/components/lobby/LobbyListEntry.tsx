import { useContext, useState } from "react";
import { UserContext } from "../../App";
import { Lobby } from "../../models/lobby";
import { useStompClient } from "react-stomp-hooks";

type LobbyListEntryProps = {
  lobby: Lobby;
};

function LobbyListEntry({ lobby }: LobbyListEntryProps) {
  const { userNickName } = useContext(UserContext);
  const [password, setPassword] = useState<string>("");

  const stompClient = useStompClient();

  function addPlayerToLobby(lobbyId: number, nickName: string, password: string) {
    if (stompClient) {
      stompClient.publish({
        destination: "/app/add-player-to-lobby",
        body: JSON.stringify({ lobbyId: lobbyId, nickName: nickName, password: password }),
      });
    }
  }

  return (
    <div className="bg-violet-400 mb-4 p-1 rounded w-full">
      <div className="flex justify-between items-center my-1">
        <p className="pl-1 text-gray-950 ">Lobby {lobby.id}</p>
        <div>
          {lobby.private && (
            <>
              <input
                className="w-32 h-8 rounded p-2 mr-2 text-black placeholder:text-gray-700"
                type="password"
                name="lobby-password"
                id="lobby-password"
                placeholder="Password"
                onChange={(e) => setPassword(e.currentTarget.value)}
              />
            </>
          )}
          <button
            className="bg-violet-800 px-2 py-1  rounded"
            onClick={() => addPlayerToLobby(lobby.id!, userNickName!, password)}
          >
            Join
          </button>
        </div>
      </div>

      <div className="bg-violet-800  p-1 rounded">
        <p className="pl-1">Players</p>
        <ol>
          {lobby.users.map((lobbyUser, index) => (
            <li className="bg-gray-950 pl-1" key={`listEntry${lobby.id}-${index}`}>
              {" "}
              {lobbyUser || "Free"}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export default LobbyListEntry;
