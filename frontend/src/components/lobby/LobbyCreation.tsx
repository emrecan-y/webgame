import { useState } from "react";
import { useStompClient } from "react-stomp-hooks";

type LobbyCreationProps = {
  setShowCreationWindow: React.Dispatch<React.SetStateAction<boolean>>;
};

function LobbyCreation(props: LobbyCreationProps) {
  const [lobbySize, setLobbySize] = useState(2);
  const [lobbyPassword, setLobbyPassword] = useState("");

  const stompClient = useStompClient();

  function createLobby(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (stompClient) {
      stompClient.publish({
        destination: "/app/create-lobby",
        body: JSON.stringify({ password: lobbyPassword, size: lobbySize }),
      });
    } else {
      //Handle error
    }
    props.setShowCreationWindow(false);
  }

  return (
    <>
      <form onSubmit={(e) => createLobby(e)}>
        <label htmlFor="lobby-size">Lobby Size</label>
        <input
          type="number"
          id="lobby-size"
          name="lobby-size"
          min={1}
          max={4}
          value={lobbySize}
          onChange={(e) => setLobbySize(e.currentTarget.valueAsNumber)}
        />
        <label htmlFor="lobby-password">Password</label>
        <input
          type="password"
          id="lobby-password"
          name="lobby-password"
          value={lobbyPassword}
          onChange={(e) => setLobbyPassword(e.currentTarget.value)}
        />
        <input type="submit" value="Create" />
      </form>
    </>
  );
}

export default LobbyCreation;
