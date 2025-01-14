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
    <div className="fixed mt-2 flex  flex-col items-center z-20">
      <div
        className="fixed top-0 backdrop-blur-[4px] left-0 bg-black bg-opacity-40 w-screen h-screen cursor-pointer -z-10"
        onClick={() => props.setShowCreationWindow(false)}
      ></div>

      <form
        className="fixed shadow-inner  bg-violet-400 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded p-2 w-max flex flex-col"
        onSubmit={(e) => createLobby(e)}
      >
        <p className="text-black">Create New Lobby</p>

        <div className="flex flex-row justify-between">
          <div className="flex flex-col w-max p-1 rounded bg-violet-800">
            <label className="text-white" htmlFor="lobby-size">
              Lobby Size
            </label>
            <input
              type="number"
              className="bg-black"
              id="lobby-size"
              name="lobby-size"
              min={1}
              max={4}
              value={lobbySize}
              onChange={(e) => setLobbySize(e.currentTarget.valueAsNumber)}
            />
          </div>

          <div className="flex flex-col w-max p-1 ml-2 rounded bg-violet-800">
            <label className="text-white" htmlFor="lobby-password">
              Password
            </label>
            <input
              className="bg-black"
              type="password"
              id="lobby-password"
              name="lobby-password"
              value={lobbyPassword}
              onChange={(e) => setLobbyPassword(e.currentTarget.value)}
            />
          </div>
        </div>
        <div className="flex flex-row justify-end">
          <input
            className="bg-violet-800 px-2 py-1 mt-2 rounded cursor-pointer mr-2"
            type="button"
            onClick={() => props.setShowCreationWindow(false)}
            value="Cancel"
          />
          <input className="bg-violet-800 px-2 py-1 mt-2 rounded cursor-pointer " type="submit" value="Create" />
        </div>
      </form>
    </div>
  );
}

export default LobbyCreation;
