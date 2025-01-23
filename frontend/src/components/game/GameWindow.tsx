import { useContext, useEffect, useState } from "react";
import { useStompClient, useSubscription } from "react-stomp-hooks";
import { UnoCardDisplay } from "./UnoCardDisplay";
import { UserContext } from "../context/UserContext";
import { UnoGameState } from "../../models/unoGameState";
import { useNavigate } from "react-router-dom";
import { PlayerRequest } from "../../models/playerRequest";
import { UnoCard, UnoCardColor } from "../../models/unoCard";
import UnoColorPicker from "./UnoColorPicker";
import UnoGameButtons from "./UnoGameButtons";
import UnoPlayersInfo from "./UnoPlayersInfo";

function GameWindow() {
  const { userNickName, userLobbyId, lobbyPassWord } = useContext(UserContext);
  const stompClient = useStompClient();
  const navigate = useNavigate();

  const [gameState, setGameState] = useState<UnoGameState>();
  const [idToColorPick, setIdToColorPick] = useState<number>();
  const [mouseEvent, setMouseEvent] =
    useState<React.MouseEvent<HTMLDivElement, MouseEvent>>();

  const isUserTurn = gameState?.currentUser === userNickName;

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

  function makeMoveEventHandler(
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    card: UnoCard,
  ) {
    if (card.cardType === "SELECT_COLOR" || card.cardType === "DRAW_FOUR") {
      setMouseEvent(event);
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

  if (gameState !== undefined) {
    return (
      <>
        {idToColorPick !== undefined && mouseEvent !== undefined && (
          <UnoColorPicker
            mouseEvent={mouseEvent}
            setMouseEvent={setMouseEvent}
            pickColor={pickColor}
          />
        )}

        <div className="flex flex-col items-center">
          <UnoPlayersInfo
            users={gameState.users}
            currentUser={gameState.currentUser}
          />
          <div className="mt-32">
            <UnoCardDisplay
              color={gameState.centerCard.color}
              cardType={gameState.centerCard.cardType}
              colorOverride={gameState.colorOverride}
            />
          </div>
          <div className="h-32 pt-3">
            <UnoGameButtons
              request={request}
              isDrawPossible={gameState.isDrawPossible}
              isUserTurn={isUserTurn}
              drawCount={gameState.drawCount}
            />
          </div>

          <div className="flex gap-2">
            {gameState.userCards.map((element) => (
              <div
                className="transition-transform hover:scale-110"
                onClick={(event) => makeMoveEventHandler(event, element)}
                key={"uno-card-" + element.id}
              >
                <UnoCardDisplay
                  color={element.color}
                  cardType={element.cardType}
                />
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
