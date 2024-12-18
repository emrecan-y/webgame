import { useContext, useState } from "react";

import { StompSessionProvider } from "react-stomp-hooks";
import { ChatWindow } from "./ChatWindow";
import { urlBackendPort, urlDomain } from "../../api";
import { UserContext } from "../../App";

function Chat() {
  const [showChatWindow, setShowChatWindow] = useState(false);
  const { userNickName } = useContext(UserContext);

  return (
    userNickName !== "" && (
      <>
        <StompSessionProvider url={`ws://${urlDomain}:${urlBackendPort}/chat`}>
          <ChatWindow showChatWindow={showChatWindow} setShowChatWindow={setShowChatWindow} />
        </StompSessionProvider>
        <button id="chat-btn" onClick={() => setShowChatWindow(!showChatWindow)}>
          Global Chat
        </button>
      </>
    )
  );
}

export default Chat;
