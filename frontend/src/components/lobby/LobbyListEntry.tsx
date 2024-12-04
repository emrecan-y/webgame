import { useContext } from "react";
import { UserContext } from "../../App";
import { Lobby } from "../../models/lobby";

type LobbyListEntryProps = {
  lobby: Lobby;
};

function joinLooby(lobbyId: number, playerName: string) {
  fetch(
    "http://localhost:8080/lobby-list" +
      "?lobbyId=" +
      lobbyId +
      "&playerName=" +
      playerName,
    {
      method: "PUT",
      headers: { "Content-type": "application/json" },
    }
  ).then((response) => {
    console.log(response);
  });
}

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
      <form>
        {props.lobby.isPrivate ? (
          <>
            <label htmlFor="lobby-password">Password</label>
            <input type="password" name="lobby-password" id="lobby-password" />
          </>
        ) : (
          ""
        )}
        <button
          onClick={() => joinLooby(props.lobby.id!, userContext.userNickName!)}
        >
          Join
        </button>
      </form>
    </div>
  );
}

export default LobbyListEntry;
