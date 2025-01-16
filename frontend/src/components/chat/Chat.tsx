import { useContext } from "react";
import { UserContext } from "../App";
import { ChatWindow } from "./ChatWindow";

function Chat() {
  const { userLobbyId } = useContext(UserContext);

  const globaChat = (
    <ChatWindow
      buttonText={"Global"}
      receiveDestinationTopic={"/topic/chat/global-chat"}
      receiveDestinationUser={"/user/queue/chat/global-chat"}
      sendDestination={"/app/chat/global-chat"}
      connectDestination={"/app/connect/global-chat"}
    />
  );

  const lobbyChat = (
    <ChatWindow
      key={userLobbyId}
      buttonText={`Lobby${userLobbyId}`}
      receiveDestinationTopic={`/topic/chat/lobby/${userLobbyId}`}
      receiveDestinationUser={`/user/queue/chat/lobby/${userLobbyId}`}
      sendDestination={`/app/chat/lobby/${userLobbyId}`}
      connectDestination={`/app/connect/lobby/${userLobbyId}`}
    />
  );

  return (
    <div className="flex flex-row gap-x-1 items-end fixed bottom-0 right-0.5">
      {userLobbyId !== -1 && <div className="flex flex-col items-end drop-shadow-2xl">{lobbyChat}</div>}
      <div className="flex flex-col items-end drop-shadow-2xl">{globaChat}</div>
    </div>
  );
}

export default Chat;
