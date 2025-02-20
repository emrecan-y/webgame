import { useStompClient } from "react-stomp-hooks";
import { BirGameState } from "../../models/birGameState";
import { GeneralPlayerRequest } from "../../models/requests";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { BirCardDisplay, BirCardTopViewDisplay } from "./BirCardDisplay";
import { AnimatePresence, motion } from "motion/react";

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
    <div className="flex h-72 scale-75 flex-col items-center justify-center">
      <div className="h-8 text-xl">
        <p className="animate-bounce">{infoText}</p>
      </div>

      <div className="flex gap-2">
        <motion.div
          className="relative"
          onClick={() => drawButtonHandler(drawCount)}
          whileHover={{
            scale: 1.05,
            transition: { duration: 0.15 },
          }}
          whileTap={{
            scale: 0.9,
            transition: { duration: 0.15 },
          }}
        >
          {drawCount != 0 && (
            <p className="border-bir-white bg-bir-red text-bir-yellow absolute left-1/2 top-3 z-20 -translate-x-1/2 rounded-xl border-4 border-solid p-1 text-2xl font-extrabold">
              <span className="drop-shadow-bir-small-text">{drawCount}x</span>
            </p>
          )}
          <BirCardTopViewDisplay />
        </motion.div>
        <div className="relative w-28">
          <AnimatePresence>
            <motion.div
              className="absolute"
              key={`bir-card-${gameState.centerCard.id}`}
              initial={{ opacity: 0, top: "-40px" }}
              animate={{ opacity: 1, top: 0 }}
              exit={{
                opacity: 0,
                transition: { delay: 0.5 },
              }}
              transition={{ type: "linear" }}
            >
              <BirCardDisplay
                color={gameState.centerCard.color}
                cardType={gameState.centerCard.cardType}
                colorOverride={gameState.colorOverride}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex w-28 flex-col justify-between text-xl">
          {isBirPossible ? (
            <motion.button
              className={
                "border-bir-white bg-bir-red rounded border-8 border-solid p-5 transition-transform duration-100 hover:scale-105"
              }
              onClick={bir}
              whileHover={{
                scale: 1.05,
                transition: { duration: 0.15 },
              }}
              whileTap={{
                scale: 0.9,
                transition: { duration: 0.15 },
              }}
            >
              BİR!
            </motion.button>
          ) : (
            <button
              className={
                "bg-bir-black rounded border-8 border-solid border-game-main-medium p-5 text-game-main-medium hover:cursor-default"
              }
            >
              BİR!
            </button>
          )}

          {isPassPossible ? (
            <motion.button
              className={
                "border-bir-white bg-bir-red rounded border-8 border-solid p-5 transition-transform duration-100 hover:scale-105"
              }
              onClick={pass}
              whileHover={{
                scale: 1.05,
                transition: { duration: 0.15 },
              }}
              whileTap={{
                scale: 0.9,
                transition: { duration: 0.15 },
              }}
            >
              PASS
            </motion.button>
          ) : (
            <button
              className={
                "bg-bir-black rounded border-8 border-solid border-game-main-medium p-5 text-game-main-medium hover:cursor-default"
              }
            >
              PASS
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default BirGameCenter;
