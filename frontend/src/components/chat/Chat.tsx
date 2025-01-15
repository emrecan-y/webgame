import { useContext, useMemo } from "react";
import { UserContext } from "../../App";
import { ChatWindow } from "./ChatWindow";

function Chat() {
  const userContext = useContext(UserContext);

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
      key={userContext.userLobbyId}
      buttonText={`Lobby${userContext.userLobbyId}`}
      receiveDestinationTopic={`/topic/chat/lobby/${userContext.userLobbyId}`}
      receiveDestinationUser={`/user/queue/chat/lobby/${userContext.userLobbyId}`}
      sendDestination={`/app/chat/lobby/${userContext.userLobbyId}`}
      connectDestination={`/app/connect/lobby/${userContext.userLobbyId}`}
    />
  );

  return (
    <div className="flex flex-row gap-x-1 items-end fixed bottom-0 right-0.5">
      {userContext.userLobbyId !== -1 && <div className="flex flex-col items-end drop-shadow-2xl">{lobbyChat}</div>}
      <div className="flex flex-col items-end drop-shadow-2xl">{globaChat}</div>
    </div>
  );
}

export default Chat;
