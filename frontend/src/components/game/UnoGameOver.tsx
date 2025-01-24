import { useNavigate } from "react-router-dom";
import { UnoUser } from "../../models/unoGameState";
import { useStompClient, useSubscription } from "react-stomp-hooks";
import { PlayerRequest } from "../../models/playerRequest";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

type UnoGameOverProps = { users: UnoUser[]; restartGame: () => void };

function UnoGameOver({ users, restartGame }: UnoGameOverProps) {
  const stompClient = useStompClient();
  const { userNickName, userLobbyId, lobbyPassWord } = useContext(UserContext);
  const navigate = useNavigate();

  const winnerName = users.find((user) => user.cardCount === 0)?.name;

  useSubscription(`/topic/game-${userLobbyId}/exit`, () => {
    navigate("/lobbies");
  });

  function exitGame() {
    const request: PlayerRequest = {
      lobbyId: userLobbyId,
      nickName: userNickName,
      lobbyPassword: lobbyPassWord,
    };
    if (stompClient) {
      stompClient.publish({
        destination: "/app/game/exit",
        body: JSON.stringify(request),
      });
    }
  }

  return (
    <>
      <div className="fixed left-0 top-0 z-10 h-screen w-screen cursor-pointer bg-game-main-dark bg-opacity-40 backdrop-blur-[4px]"></div>
      <div className="fixed z-20 h-32 w-72 rounded bg-game-accent-light p-3">
        <p className="mt-2 text-center text-game-main-dark">
          {"🎉 "}
          <span className="font-bold text-game-accent-dark">{winnerName} </span>
          has won! 🎉
        </p>
        <div className="mt-10 flex justify-end">
          <button
            onClick={restartGame}
            className="w-fi mr-2 rounded bg-game-accent-medium px-2 py-1"
          >
            Restart
          </button>
          <button
            onClick={exitGame}
            className="w-fit rounded bg-game-accent-medium px-2 py-1"
          >
            Exit
          </button>
        </div>
      </div>
    </>
  );
}

export default UnoGameOver;
