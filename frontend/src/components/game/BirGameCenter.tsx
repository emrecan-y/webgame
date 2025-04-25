import { useStompClient } from "react-stomp-hooks";
import { BirGameState } from "../../models/birGameState";
import { GeneralPlayerRequest } from "../../models/requests";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { BirCardFront, BirCardBack } from "./BirCard";
import { AnimatePresence, motion } from "motion/react";
import MotionButton from "../ui/MotionButton";

type BirGameCenterProps = {
  gameState: BirGameState;
  request: GeneralPlayerRequest;
};

function BirGameCenter({ gameState, request }: BirGameCenterProps) {
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
    <div className="relative flex scale-75 flex-col items-center justify-center">
      <div className="absolute -top-8 h-8 text-xl">
        <p className="animate-bounce">{infoText}dwdw</p>
      </div>

      <div className="flex gap-2">
        <MotionButton
          className="relative flex justify-center"
          onClick={() => drawButtonHandler(drawCount)}
        >
          <AnimatePresence>
            {drawCount != 0 && (
              <motion.div
                key={`draw-${drawCount}x`}
                className="absolute top-3 z-20 rounded-xl border-4 border-solid border-bir-white bg-game-accent-medium p-1 text-2xl font-extrabold text-bir-yellow"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ type: "linear" }}
              >
                <p className="drop-shadow-bir-small-text">{drawCount}x</p>
              </motion.div>
            )}
          </AnimatePresence>
          <BirCardBack />
        </MotionButton>
        <div className="relative w-28">
          <AnimatePresence>
            <motion.div
              className="absolute"
              key={`bir-card-${gameState.centerCard.id}`}
              initial={{ top: "-40px" }}
              animate={{ top: 0 }}
              exit={{
                opacity: 0,
                transition: { delay: 0.5 },
              }}
              transition={{ type: "linear" }}
            >
              <BirCardFront
                color={gameState.centerCard.color}
                cardType={gameState.centerCard.cardType}
                colorOverride={gameState.colorOverride}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex w-28 flex-col justify-between text-xl">
          <MotionButton
            className={
              isBirPossible
                ? "rounded border-8 border-solid border-bir-white bg-game-accent-medium p-5"
                : "rounded border-8 border-solid border-game-main-medium bg-bir-black p-5 text-game-main-medium hover:cursor-default"
            }
            onClick={bir}
            disableAnimation={!isBirPossible}
          >
            BİR!
          </MotionButton>

          <MotionButton
            className={
              isPassPossible
                ? "rounded border-8 border-solid border-bir-white bg-game-accent-medium p-5"
                : "rounded border-8 border-solid border-game-main-medium bg-bir-black p-5 text-game-main-medium hover:cursor-default"
            }
            onClick={pass}
            disableAnimation={!isPassPossible}
          >
            PASS
          </MotionButton>
        </div>
      </div>
    </div>
  );
}

export default BirGameCenter;
