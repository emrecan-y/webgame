import { useContext, useState } from "react";

import { ChatWindow } from "./ChatWindow";
import { UserContext } from "../../App";

function Chat() {
  const [showChatWindow, setShowChatWindow] = useState(false);
  const { userNickName } = useContext(UserContext);

  return (
    userNickName !== "" && (
      <div className="flex flex-col items-end fixed bottom-0 right-0 bg-light-blue-500">
        <ChatWindow showChatWindow={showChatWindow} setShowChatWindow={setShowChatWindow} />
        <button className="bg-violet-800 p-3 rounded-tl-xl" onClick={() => setShowChatWindow(!showChatWindow)}>
          Global Chat
        </button>
      </div>
    )
  );
}

export default Chat;
