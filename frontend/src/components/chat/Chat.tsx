import { useState } from "react";
import "./Chat.css";

import { StompSessionProvider } from "react-stomp-hooks";
import { ChatWindow } from "./ChatWindow";

function Chat() {
  const [showChatWindow, setShowChatWindow] = useState(false);
  return (
    <div id="chat-element">
      <StompSessionProvider url={"ws://localhost:8080/chat"}>
        <ChatWindow
          showChatWindow={showChatWindow}
          setShowChatWindow={setShowChatWindow}
        />
      </StompSessionProvider>
      <button id="chat-btn" onClick={() => setShowChatWindow(!showChatWindow)}>
        Global Chat
      </button>
    </div>
  );
}

export default Chat;
