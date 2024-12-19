import { useContext } from "react";
import { UserContext } from "../../App";
import { Lobby } from "../../models/lobby";
import { addPlayerToLobby } from "../../api";

type LobbyListEntryProps = {
  lobby: Lobby;
};

function LobbyListEntry({ lobby }: LobbyListEntryProps) {
  const { userNickName } = useContext(UserContext);

  return (
    <div className="bg-violet-400 mb-4 p-1 rounded">
      <div className="flex justify-between items-center my-1">
        <p className="pl-1 text-gray-950 ">Lobby {lobby.id}</p>
        <button className="bg-violet-800 px-2 py-1  rounded" onClick={() => addPlayerToLobby(lobby.id!, userNickName!)}>
          Join
        </button>
      </div>

      <div className="bg-violet-800  p-1 rounded">
        <p className="pl-1">Players</p>
        <ol>
          {lobby.users.map((lobbyUser, index) => (
            <li className="bg-gray-950 pl-1" key={`listEntry${lobby.id}-${index}`}>
              {" "}
              {lobbyUser}
            </li>
          ))}
        </ol>
      </div>

      <div>
        {lobby.isPrivate && (
          <>
            <label htmlFor="lobby-password">Password</label>
            <input type="password" name="lobby-password" id="lobby-password" />
          </>
        )}
      </div>
    </div>
  );
}

export default LobbyListEntry;
