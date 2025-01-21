import { useContext, useEffect, useState } from "react";
import { useStompClient, useSubscription } from "react-stomp-hooks";
import { UnoCardDisplay } from "./UnoCardDisplay";
import { UserContext } from "../context/UserContext";
import { UnoGameState } from "../../models/unoGameState";
import { useNavigate } from "react-router-dom";
import { PlayerRequest } from "../../models/playerRequest";

function GameWindow() {
  const { userNickName, userLobbyId, lobbyPassWord } = useContext(UserContext);
  const stompClient = useStompClient();
  const navigate = useNavigate();

  const [gameState, setGameState] = useState<UnoGameState>();
  const isUserTurn = gameState?.users[gameState.currentUserIndex] === userNickName;

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

  function makeMove(cardId: number) {
    if (stompClient) {
      const newRequest: PlayerRequest = { ...request, cardId: cardId };
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
      <div className="flex flex-col items-center">
        <div className="">
          <UnoCardDisplay color={gameState.centerCard.color} cardType={gameState.centerCard.cardType} />
        </div>

        {isUserTurn && (
          <>
            <p className="">It's your turn</p>{" "}
            {gameState.isDrawPossible ? (
              <button className="bg-game-accent-medium p-3 rounded" onClick={drawCard}>
                DrawCard
              </button>
            ) : (
              <button className="bg-game-accent-medium p-3 rounded" onClick={pass}>
                Pass
              </button>
            )}
          </>
        )}
        <div className="flex gap-2 mt-16">
          {gameState?.userCards.map((e) => (
            <div className=" hover:scale-110 transition-transform" onClick={() => makeMove(e.id)}>
              <UnoCardDisplay color={e.color} cardType={e.cardType} />
            </div>
          ))}
        </div>
      </div>
    );
  } else {
    return (
      <div className="text-center rounded bg-game-accent-medium text-game-main-light p-3 animate-bounce">
        <h1>The game is loading.</h1>

        <div className="flex justify-center items-center gap-1 mt-1">
          <h1> Please wait</h1>
          <span className="w-8 h-8 border-4 border-game-accent-light border-b-transparent rounded-full inline-block animate-spin"></span>
        </div>
      </div>
    );
  }
}

export default GameWindow;
