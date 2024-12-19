import { useContext, useState } from "react";

import { ChatWindow } from "./ChatWindow";
import { UserContext } from "../../App";

function Chat() {
  const [showChatWindow, setShowChatWindow] = useState(false);
  const { userNickName } = useContext(UserContext);

  return (
    userNickName !== "" && (
      <div className="fixed bottom-0 right-0 bg-light-blue-500">
        <ChatWindow showChatWindow={showChatWindow} setShowChatWindow={setShowChatWindow} />
        <button id="chat-btn" onClick={() => setShowChatWindow(!showChatWindow)}>
          Global Chat
        </button>
      </div>
    )
  );
}

export default Chat;
