import { UnoUser } from "../../models/unoGameState";
import { useStompClient } from "react-stomp-hooks";
import { GeneralPlayerRequest } from "../../models/requests";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

type UnoGameOverProps = { users: UnoUser[]; restartGame: () => void };

function UnoGameOver({ users, restartGame }: UnoGameOverProps) {
  const stompClient = useStompClient();
  const { userNickName, userLobbyId, lobbyPassWord } = useContext(UserContext);
  const usersSortedByWinCount = [...users].sort(
    (a, b) => b.winCount - a.winCount,
  );

  const winnerName = users.find((user) => user.cardCount === 0)?.name;

  function exitGame() {
    const request: GeneralPlayerRequest = {
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
      <div className="fixed z-20 h-max w-72 rounded bg-game-accent-light p-2">
        <p className="mt-2 text-center text-game-main-dark">
          {"🎉 "}
          <span className="font-bold text-game-accent-dark">{winnerName} </span>
          has won! 🎉
        </p>
        <div className="mt-2 rounded bg-game-accent-medium p-1">
          <p>Total Scores</p>
          {usersSortedByWinCount.map((user) => (
            <div className="flex justify-between bg-game-main-dark px-1">
              <p>{user.name}</p>
              <p>{user.winCount}</p>
            </div>
          ))}
        </div>
        <div className="mt-2 flex justify-end">
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
