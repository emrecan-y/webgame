import { useContext } from "react";
import { ChatWindow } from "./ChatWindow";
import { UserContext } from "../context/UserContext";
import { useChatStore } from "./ChatStore";
import { useSubscription } from "react-stomp-hooks";

function Chat() {
  const { userNickName, userLobbyId } = useContext(UserContext);
  const { hideAllChats, isAnyChatActive, setIsChatDisabled } = useChatStore();

  useSubscription("/user/queue/disable-chat", (message) => {
    const remainingCoolDownInSeconds = parseInt(message.body);
    setIsChatDisabled(true);

    const timeOut = setTimeout(() => {
      setIsChatDisabled(false);
    }, remainingCoolDownInSeconds * 1000);

    return () => {
      clearTimeout(timeOut);
    };
  });

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

  if (userNickName) {
    return (
      <>
        {isAnyChatActive() && (
          <div
            className="fixed left-0 top-0 z-40 h-dvh w-screen"
            onClick={hideAllChats}
          ></div>
        )}

        <div className="fixed bottom-0.5 right-0.5 z-50 flex flex-row items-end gap-x-1 text-sm sm:text-base">
          {userLobbyId !== -1 && (
            <div className="relative flex flex-col items-end drop-shadow-2xl">
              {lobbyChat}
            </div>
          )}
          <div className="flex flex-col items-end drop-shadow-2xl">
            {globaChat}
          </div>
        </div>
      </>
    );
  }
}

export default Chat;
