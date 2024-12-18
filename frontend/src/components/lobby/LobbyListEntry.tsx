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
    <div className="lobby-list-entry">
      <p>ID: {lobby.id}</p>
      <ol>
        {lobby.users.map((lobbyUser) => (
          <li key={`lobbyListEntry${lobby.id}-${userNickName}`}> {lobbyUser}</li>
        ))}
      </ol>
      <div>
        {lobby.isPrivate && (
          <>
            <label htmlFor="lobby-password">Password</label>
            <input type="password" name="lobby-password" id="lobby-password" />
          </>
        )}
        <button onClick={() => addPlayerToLobby(lobby.id!, userNickName!)}>Join</button>
      </div>
    </div>
  );
}

export default LobbyListEntry;
