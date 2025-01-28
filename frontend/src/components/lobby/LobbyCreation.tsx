import { useContext, useState } from "react";
import { useStompClient } from "react-stomp-hooks";
import { UserContext } from "../context/UserContext";
import { LobbyCreateRequest } from "../../models/requests";

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
    const request: LobbyCreateRequest = {
      lobbyPassword: lobbyPassword,
      lobbySize: lobbySize,
    };
    if (stompClient) {
      stompClient.publish({
        destination: "/app/create-lobby",
        body: JSON.stringify(request),
      });
      setLobbyPassWord(lobbyPassword);
    } else {
      //Handle error
    }
    props.setShowCreationWindow(false);
  }

  return (
    <div className="fixed z-20 mt-2 flex flex-col items-center">
      <div
        className="fixed left-0 top-0 -z-10 h-screen w-screen cursor-pointer bg-game-main-dark bg-opacity-40 backdrop-blur-[4px]"
        onClick={() => props.setShowCreationWindow(false)}
      ></div>

      <form
        className="fixed left-1/2 top-1/2 flex w-max -translate-x-1/2 -translate-y-1/2 flex-col rounded bg-game-accent-light p-2 shadow-inner"
        onSubmit={(e) => createLobby(e)}
      >
        <p className="mb-1 text-game-main-dark">Create New Lobby</p>

        <div className="flex flex-row justify-between">
          <div className="flex w-max flex-col rounded bg-game-accent-medium p-1">
            <label className="text-game-main-light" htmlFor="lobby-size">
              Lobby Size
            </label>
            <input
              type="number"
              className="bg-black px-1"
              id="lobby-size"
              name="lobby-size"
              min={2}
              max={8}
              value={lobbySize}
              onChange={(e) => setLobbySize(e.currentTarget.valueAsNumber)}
            />
          </div>

          <div className="ml-2 flex w-max flex-col rounded bg-game-accent-medium p-1">
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
            className="mr-2 mt-2 cursor-pointer rounded bg-game-accent-medium px-2 py-1"
            type="button"
            onClick={() => props.setShowCreationWindow(false)}
            value="Cancel"
          />
          <input
            className="mt-2 cursor-pointer rounded bg-game-accent-medium px-2 py-1"
            type="submit"
            value="Create"
          />
        </div>
      </form>
    </div>
  );
}

export default LobbyCreation;
