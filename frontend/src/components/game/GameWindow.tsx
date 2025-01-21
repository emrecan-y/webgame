import { useContext, useEffect, useState } from "react";
import { useStompClient, useSubscription } from "react-stomp-hooks";
import { UnoCardDisplay } from "./UnoCardDisplay";
import { UserContext } from "../context/UserContext";
import { UnoGameState } from "../../models/unoGameState";
import { useNavigate } from "react-router-dom";
import { PlayerRequest } from "../../models/playerRequest";
import { UnoCard, UnoCardColor } from "../../models/unoCard";

function GameWindow() {
  const { userNickName, userLobbyId, lobbyPassWord } = useContext(UserContext);
  const stompClient = useStompClient();
  const navigate = useNavigate();

  const [gameState, setGameState] = useState<UnoGameState>();
  const [idToColorPick, setIdToColorPick] = useState<number>();

  const isUserTurn =
    gameState?.users[gameState.currentUserIndex] === userNickName;

  const request: PlayerRequest = {
    lobbyId: userLobbyId,
    nickName: userNickName,
    lobbyPassword: lobbyPassWord,
  };

  useEffect(() => {
    if (stompClient) {
      stompClient.publish({
        destination: "/app/game/state",
        body: JSON.stringify(request),
      });
    }
  }, []);

  useSubscription("/user/queue/game/state", (message) => {
    const gameState: UnoGameState = JSON.parse(message.body);
    setGameState(gameState);
  });

  useSubscription(`/topic/game/${userLobbyId}/stop`, () => {
    navigate("/lobbies");
  });

  function makeMoveEventHandler(card: UnoCard) {
    if (card.cardType === "SELECT_COLOR" || card.cardType === "DRAW_FOUR") {
      setIdToColorPick(card.id);
    } else {
      makeMove(card.id);
    }
  }

  function pickColor(color: UnoCardColor) {
    if (idToColorPick !== undefined) {
      makeMove(idToColorPick, color);
      setIdToColorPick(undefined);
    }
  }

  function makeMove(cardId: number, pickedColor?: UnoCardColor) {
    if (stompClient) {
      const newRequest: PlayerRequest = {
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

  function drawCard() {
    if (stompClient) {
      stompClient.publish({
        destination: "/app/game/draw-card",
        body: JSON.stringify(request),
      });
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

  if (gameState !== undefined) {
    return (
      <>
        {idToColorPick !== undefined && (
          <div className="flex flex-col items-center rounded-xl bg-game-accent-medium p-6">
            <p>Select a color!</p>
            <div className="mt-4 flex h-40 w-40 flex-wrap rounded-full border-4 border-uno-black bg-uno-white outline outline-8 outline-uno-white">
              <div
                onClick={() => pickColor("RED")}
                className="h-1/2 w-1/2 rounded-tl-[100%] bg-uno-red transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:scale-105"
              ></div>
              <div
                onClick={() => pickColor("BLUE")}
                className="h-1/2 w-1/2 rounded-tr-[100%] bg-uno-blue transition-transform hover:-translate-y-0.5 hover:translate-x-0.5 hover:scale-105"
              ></div>
              <div
                onClick={() => pickColor("GREEN")}
                className="h-1/2 w-1/2 rounded-bl-[100%] bg-uno-green transition-transform hover:-translate-x-0.5 hover:translate-y-0.5 hover:scale-105"
              ></div>
              <div
                onClick={() => pickColor("YELLOW")}
                className="h-1/2 w-1/2 rounded-br-[100%] bg-uno-yellow transition-transform hover:translate-x-0.5 hover:translate-y-0.5 hover:scale-105"
              ></div>
            </div>
          </div>
        )}

        <div className="flex flex-col items-center">
          <div className="">
            <UnoCardDisplay
              color={gameState.centerCard.color}
              cardType={gameState.centerCard.cardType}
              colorOverride={gameState.colorOverride}
            />
          </div>

          {isUserTurn && (
            <>
              <p className="">It's your turn</p>{" "}
              {gameState.isDrawPossible ? (
                <button
                  className="rounded bg-game-accent-medium p-3"
                  onClick={drawCard}
                >
                  DrawCard
                </button>
              ) : (
                <button
                  className="rounded bg-game-accent-medium p-3"
                  onClick={pass}
                >
                  Pass
                </button>
              )}
            </>
          )}
          <div className="mt-16 flex gap-2">
            {gameState?.userCards.map((e) => (
              <div
                className="transition-transform hover:scale-110"
                onClick={() => makeMoveEventHandler(e)}
              >
                <UnoCardDisplay color={e.color} cardType={e.cardType} />
              </div>
            ))}
          </div>
        </div>
      </>
    );
  } else {
    return (
      <div className="animate-bounce rounded bg-game-accent-medium p-3 text-center text-game-main-light">
        <h1>The game is loading.</h1>

        <div className="mt-1 flex items-center justify-center gap-1">
          <h1> Please wait</h1>
          <span className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-game-accent-light border-b-transparent"></span>
        </div>
      </div>
    );
  }
}

export default GameWindow;
