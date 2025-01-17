import { useContext, useEffect, useState } from "react";
import { UnoCard } from "../../models/unoCard";
import { useStompClient, useSubscription } from "react-stomp-hooks";
import { UnoCardDisplay } from "./UnoCardDisplay";
import { UserContext } from "../context/UserContext";

function GameWindow() {
  const [userCards, setUserCards] = useState<UnoCard[]>([]);
  const { userNickName, userLobbyId, lobbyPassWord } = useContext(UserContext);

  const stompClient = useStompClient();
  useEffect(() => {
    console.log(lobbyPassWord);
    if (stompClient) {
      stompClient.publish({
        destination: "/app/game/player-deck",
        body: JSON.stringify({ lobbyId: userLobbyId, nickName: userNickName, password: lobbyPassWord }),
      });
    }
  }, []);

  useSubscription("/user/queue/game", (message) => {
    const userCards: UnoCard[] = JSON.parse(message.body);
    setUserCards(userCards);
  });

  return (
    <>
      {userCards.map((e) => (
        <UnoCardDisplay color={e.color} cardType={e.cardType} />
      ))}
    </>
  );
}

export default GameWindow;
