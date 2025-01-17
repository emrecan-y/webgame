import { useContext, useState } from "react";
import { useStompClient } from "react-stomp-hooks";
import { UserContext } from "../context/UserContext";

type LobbyCreationProps = {
  setShowCreationWindow: React.Dispatch<React.SetStateAction<boolean>>;
};

function LobbyCreation(props: LobbyCreationProps) {
  const [lobbySize, setLobbySize] = useState(2);
  const [lobbyPassword, setLobbyPassword] = useState("");

  const { setLobbyPassWord } = useContext(UserContext);

  const stompClient = useStompClient();

  function createLobby(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (stompClient) {
      stompClient.publish({
        destination: "/app/create-lobby",
        body: JSON.stringify({ password: lobbyPassword, size: lobbySize }),
      });
      setLobbyPassWord(lobbyPassword);
    } else {
      //Handle error
    }
    props.setShowCreationWindow(false);
  }

  return (
    <div className="fixed mt-2 flex  flex-col items-center z-20">
      <div
        className="fixed top-0 backdrop-blur-[4px] left-0 bg-game-main-dark bg-opacity-40 w-screen h-screen cursor-pointer -z-10"
        onClick={() => props.setShowCreationWindow(false)}
      ></div>

      <form
        className="fixed shadow-inner  bg-game-accent-light left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded p-2 w-max flex flex-col"
        onSubmit={(e) => createLobby(e)}
      >
        <p className="text-game-main-dark mb-1">Create New Lobby</p>

        <div className="flex flex-row justify-between">
          <div className="flex flex-col w-max p-1 rounded bg-game-accent-medium">
            <label className="text-game-main-light" htmlFor="lobby-size">
              Lobby Size
            </label>
            <input
              type="number"
              className="bg-black px-1"
              id="lobby-size"
              name="lobby-size"
              min={2}
              max={4}
              value={lobbySize}
              onChange={(e) => setLobbySize(e.currentTarget.valueAsNumber)}
            />
          </div>

          <div className="flex flex-col w-max p-1 ml-2 rounded bg-game-accent-medium">
            <label className="text-game-main-light" htmlFor="lobby-password">
              Password
            </label>
            <input
              className="bg-black px-1"
              type="password"
              id="lobby-password"
              name="lobby-password"
              value={lobbyPassword}
              placeholder="no password"
              onChange={(e) => setLobbyPassword(e.currentTarget.value)}
            />
          </div>
        </div>
        <div className="flex flex-row justify-end">
          <input
            className="bg-game-accent-medium px-2 py-1 mt-2 rounded cursor-pointer mr-2"
            type="button"
            onClick={() => props.setShowCreationWindow(false)}
            value="Cancel"
          />
          <input
            className="bg-game-accent-medium px-2 py-1 mt-2 rounded cursor-pointer "
            type="submit"
            value="Create"
          />
        </div>
      </form>
    </div>
  );
}

export default LobbyCreation;
