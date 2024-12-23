import { useContext, useEffect } from "react";
import { UserContext } from "../../App";
import { ChatWindow, ChatWindowProps } from "./ChatWindow";

function Chat() {
  const userContext = useContext(UserContext);

  const globaChat: ChatWindowProps = {
    buttonText: "Global Chat",
    receiveDestinationTopic: "/topic/chat/global-chat",
    receiveDestinationUser: "/user/queue/chat/global-chat",
    sendDestination: "/app/chat/global-chat",
    connectDestination: "/app/connect/global-chat",
  };

  return (
    <div className="flex flex-row items-end fixed bottom-0 right-0 bg-light-blue-500">
      {userContext.userLobbyId !== -1 && (
        <div className="flex flex-col items-end ">
          <ChatWindow
            key={`lobby-${userContext.userLobbyId}-chat`}
            buttonText={`Lobby${userContext.userLobbyId} Chat`}
            receiveDestinationTopic={`/topic/chat/lobby/${userContext.userLobbyId}`}
            receiveDestinationUser={`/user/queue/chat/lobby/${userContext.userLobbyId}`}
            sendDestination={`/app/chat/lobby/${userContext.userLobbyId}`}
            connectDestination={`/app/connect/lobby/${userContext.userLobbyId}`}
          />
        </div>
      )}

      <div className="flex flex-col items-end ">
        <ChatWindow
          buttonText={"Global Chat"}
          receiveDestinationTopic={"/topic/chat/global-chat"}
          receiveDestinationUser={"/user/queue/chat/global-chat"}
          sendDestination={"/app/chat/global-chat"}
          connectDestination={"/app/connect/global-chat"}
        />
      </div>
    </div>
  );
}

export default Chat;
