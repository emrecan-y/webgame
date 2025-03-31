import { useContext, useEffect, useState } from "react";
import { useStompClient, useSubscription } from "react-stomp-hooks";
import { BirCardFront } from "./BirCard";
import { UserContext } from "../context/UserContext";
import { BirGameState } from "../../models/birGameState";
import { useNavigate } from "react-router-dom";
import {
  GeneralPlayerRequest,
  PlayerMakeMoveRequest,
} from "../../models/requests";
import { BirCard, BirCardColor } from "../../models/birCard";
import BirColorPicker from "./BirColorPicker";
import BirPlayersInfo from "./playersInfo/BirPlayersInfo";
import BirGameOver from "./BirGameOver";
import BirGameCenter from "./BirGameCenter";
import { AnimatePresence, motion } from "motion/react";
import MotionButton from "../ui/MotionButton";
import useTitleEffect from "../../hooks/useTitleEffect";

function GameWindow() {
  const { userNickName, userLobbyId, lobbyPassWord } = useContext(UserContext);
  const stompClient = useStompClient();
  const navigate = useNavigate();

  const [gameState, setGameState] = useState<BirGameState>();
  const [idToColorPick, setIdToColorPick] = useState<number>();
  const [mouseEvent, setMouseEvent] =
    useState<React.MouseEvent<HTMLButtonElement, MouseEvent>>();
  const [setCurrentTitle, setIsBlinking] = useTitleEffect();

  const request: GeneralPlayerRequest = {
    lobbyId: userLobbyId,
    nickName: userNickName,
    lobbyPassword: lobbyPassWord,
  };

  useEffect(() => {
    // if the game doens't load the first time, try again every 200ms
    if (!gameState) {
      getGameState();
      const intervalId = setInterval(() => {
        if (!gameState) {
          getGameState();
        } else {
          clearInterval(intervalId);
        }
      }, 200);
      return () => clearInterval(intervalId);
    }
  }, [gameState]);

  useEffect(() => {
    if (gameState?.currentUser === userNickName) {
      setCurrentTitle("- PLAY");
      setIsBlinking(true);
    } else if (gameState?.currentUser) {
      setCurrentTitle("- WAIT");
      setIsBlinking(false);
    }
  }, [gameState?.currentUser]);

  useSubscription("/user/queue/game/state", (message) => {
    const gameState: BirGameState = JSON.parse(message.body);
    setGameState(gameState);
  });

  useSubscription(`/topic/game/${userLobbyId}/stop`, () => {
    navigate("/lobbies");
  });

  function getGameState() {
    if (stompClient) {
      stompClient.publish({
        destination: "/app/game/state",
        body: JSON.stringify(request),
      });
    }
  }

  function restartGame() {
    if (stompClient) {
      stompClient.publish({
        destination: "/app/game/restart",
        body: JSON.stringify(request),
      });
    }
  }

  function makeMoveEventHandler(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    card: BirCard,
  ) {
    if (card.cardType === "SELECT_COLOR" || card.cardType === "DRAW_FOUR") {
      setMouseEvent(event);
      setIdToColorPick(card.id);
    } else {
      makeMove(card.id);
    }
  }

  function pickColor(color: BirCardColor) {
    if (idToColorPick !== undefined) {
      makeMove(idToColorPick, color);
      setIdToColorPick(undefined);
    }
  }

  function makeMove(cardId: number, pickedColor: BirCardColor = "BLACK") {
    if (stompClient) {
      const newRequest: PlayerMakeMoveRequest = {
        ...request,
        cardId: cardId,
        pickedColor: pickedColor,
      };
      stompClient.publish({
        destination: "/app/game/make-move",
        body: JSON.stringify(newRequest),
      });
    }
  }

  if (gameState !== undefined) {
    return (
      <>
        {idToColorPick !== undefined && mouseEvent !== undefined && (
          <BirColorPicker
            mouseEvent={mouseEvent}
            setMouseEvent={setMouseEvent}
            pickColor={pickColor}
          />
        )}

        <AnimatePresence>
          {gameState.isGameOver && (
            <BirGameOver users={gameState.users} restartGame={restartGame} />
          )}
        </AnimatePresence>

        <div className="relative flex h-full min-h-screen w-full flex-col items-center justify-center">
          <div className="absolute top-4">
            <BirPlayersInfo
              users={gameState.users}
              currentUserName={gameState.currentUser}
              direction={gameState.direction}
            />
          </div>

          <div className="">
            <BirGameCenter request={request} gameState={gameState} />
          </div>
          <div className="fixed bottom-10 flex w-full justify-center">
            <div className="flex overflow-x-auto overflow-y-hidden">
              <div className="flex w-fit scale-75 flex-row flex-nowrap gap-2">
                <AnimatePresence>
                  {gameState.userCards.map((element) => (
                    <MotionButton
                      className="relative"
                      onClick={(event) => makeMoveEventHandler(event, element)}
                      key={"bir-card-" + element.id}
                      initial={{ opacity: 0, top: "-40px" }}
                      exit={{ opacity: 0, top: "-40px" }}
                      animate={{ opacity: 1, top: 0 }}
                      transition={{ type: "linear" }}
                      layout
                    >
                      <BirCardFront
                        color={element.color}
                        cardType={element.cardType}
                      />
                    </MotionButton>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return (
      <motion.div
        className="animate-bounce rounded bg-game-accent-medium p-3 text-center text-game-main-light"
        initial={{
          opacity: 0,
          scale: 0,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        transition={{ type: "spring", delay: 0.5 }}
      >
        <h1>The game is loading.</h1>

        <div className="mt-1 flex items-center justify-center gap-1">
          <h1> Please wait</h1>
          <span className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-game-accent-light border-b-transparent"></span>
        </div>
      </motion.div>
    );
  }
}

export default GameWindow;
