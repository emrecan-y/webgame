import { useStompClient } from "react-stomp-hooks";
import { UnoGameState } from "../../models/unoGameState";
import { GeneralPlayerRequest } from "../../models/requests";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { UnoCardDisplay, UnoCardTopViewDisplay } from "./UnoCardDisplay";

type UnoGameButtonsProps = {
  gameState: UnoGameState;
  request: GeneralPlayerRequest;
};

function UnoGameCenter({ gameState, request }: UnoGameButtonsProps) {
  const { currentUser, drawCount, isDrawPossible, users } = gameState;
  const { userNickName } = useContext(UserContext);
  const isUserTurn = currentUser === userNickName;

  const stompClient = useStompClient();
  const isPassPossible = isUserTurn && drawCount === 0 && !isDrawPossible;
  const isBirPossible = users.some(
    (user) => user.name === userNickName && !user.hasAttemptedToDeclareBir,
  );

  let infoText: string;
  if (isUserTurn) {
    if (!isDrawPossible) {
      infoText = "Play or Pass";
    } else if (drawCount != 0) {
      infoText = `Draw ${drawCount} or Play`;
    } else {
      infoText = "Draw or Play";
    }
  } else {
    infoText = "";
  }

  function drawButtonHandler(drawCount: number) {
    if (drawCount == 0) {
      if (stompClient) {
        stompClient.publish({
          destination: "/app/game/draw-card",
          body: JSON.stringify(request),
        });
      }
    } else {
      if (stompClient) {
        stompClient.publish({
          destination: "/app/game/draw-cards",
          body: JSON.stringify(request),
        });
      }
    }
  }

  function pass() {
    if (stompClient) {
      stompClient.publish({
        destination: "/app/game/pass",
        body: JSON.stringify(request),
      });
    }
  }

  function bir() {
    if (stompClient) {
      stompClient.publish({
        destination: "/app/game/bir",
        body: JSON.stringify(request),
      });
    }
  }

  return (
    <div className="flex h-72 scale-75 flex-col items-center justify-center">
      <div className="h-8 text-xl">
        <p className="animate-bounce">{infoText}</p>
      </div>

      <div className="flex gap-2">
        <div
          className="relative hover:scale-110"
          onClick={() => drawButtonHandler(drawCount)}
        >
          {drawCount != 0 && (
            <p className="absolute left-1/2 top-3 z-20 -translate-x-1/2 rounded-xl border-4 border-solid border-uno-white bg-uno-red p-1 text-2xl font-extrabold text-uno-yellow">
              <span className="drop-shadow-uno-small-text">{drawCount}x</span>
            </p>
          )}
          <UnoCardTopViewDisplay />
        </div>
        <UnoCardDisplay
          color={gameState.centerCard.color}
          cardType={gameState.centerCard.cardType}
          colorOverride={gameState.colorOverride}
        />
        <div className="flex w-28 flex-col justify-between text-xl">
          <button
            className={`rounded border-8 border-solid p-5 ${
              isBirPossible
                ? "border-uno-white bg-uno-red"
                : "border-game-main-medium bg-uno-black text-game-main-medium hover:cursor-default"
            }`}
            onClick={isBirPossible ? bir : undefined}
          >
            BIR!
          </button>
          <button
            className={`rounded border-8 border-solid p-5 ${
              isPassPossible
                ? "border-uno-white bg-uno-red"
                : "border-game-main-medium bg-uno-black text-game-main-medium hover:cursor-default"
            }`}
            onClick={isPassPossible ? pass : undefined}
          >
            PASS
          </button>
        </div>
      </div>
    </div>
  );
}

export default UnoGameCenter;
