import { useStompClient } from "react-stomp-hooks";
import { GeneralPlayerRequest } from "../../models/requests";

type UnoGameButtonsProps = {
  isUserTurn: boolean;
  isDrawPossible: boolean;
  drawCount: number;
  request: GeneralPlayerRequest;
};

function UnoGameButtons({
  isUserTurn,
  isDrawPossible,
  drawCount,
  request,
}: UnoGameButtonsProps) {
  const stompClient = useStompClient();

  function drawCard() {
    if (stompClient) {
      stompClient.publish({
        destination: "/app/game/draw-card",
        body: JSON.stringify(request),
      });
    }
  }

  function drawCards() {
    if (stompClient) {
      stompClient.publish({
        destination: "/app/game/draw-cards",
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

  if (isUserTurn) {
    return (
      <div className="flex flex-col">
        <p className="animate-bounce">It's your turn</p>
        {drawCount != 0 ? (
          <button
            className="rounded bg-game-accent-medium p-3"
            onClick={drawCards}
          >
            Draw {drawCount}
          </button>
        ) : isDrawPossible ? (
          <button
            className="rounded bg-game-accent-medium p-3"
            onClick={drawCard}
          >
            DrawCard
          </button>
        ) : (
          <button className="rounded bg-game-accent-medium p-3" onClick={pass}>
            Pass
          </button>
        )}
      </div>
    );
  }
}

export default UnoGameButtons;
