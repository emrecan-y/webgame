import { useNavigate } from "react-router-dom";
import { UnoUser } from "../../models/unoGameState";

type UnoGameOverProps = { users: UnoUser[]; restartGame: () => void };

function UnoGameOver({ users, restartGame }: UnoGameOverProps) {
  const navigate = useNavigate();

  const winnerName = users.find((user) => user.cardCount === 0)?.name;
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
            onClick={() => navigate("/lobbies")}
            className="w-fit rounded bg-game-accent-medium px-2 py-1"
          >
            Continue
          </button>
        </div>
      </div>
    </>
  );
}

export default UnoGameOver;
