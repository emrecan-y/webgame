import { useContext } from "react";
import { UserContext } from "../../App";
import { Lobby } from "../../models/lobby";
import { addPlayerToLobby } from "../../api";

type LobbyListEntryProps = {
  lobby: Lobby;
};

function LobbyListEntry(props: LobbyListEntryProps) {
  const userContext = useContext(UserContext);

  return (
    <div className="lobby-list-entry">
      <p>ID: {props.lobby.id}</p>
      <ol>
        {props.lobby.users.map((userName) => (
          <li> {userName}</li>
        ))}
      </ol>
      <div>
        {props.lobby.isPrivate ? (
          <>
            <label htmlFor="lobby-password">Password</label>
            <input type="password" name="lobby-password" id="lobby-password" />
          </>
        ) : (
          ""
        )}
        <button onClick={() => addPlayerToLobby(props.lobby.id!, userContext.userNickName!)}>Join</button>
      </div>
    </div>
  );
}

export default LobbyListEntry;
