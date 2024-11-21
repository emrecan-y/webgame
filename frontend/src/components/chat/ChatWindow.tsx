import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useStompClient, useSubscription } from "react-stomp-hooks";
import { UserContext } from "../../App";
import { ChatMessage } from "../../models/chat";

type ChatWindowParams = {
  showChatWindow: boolean;
  setShowChatWindow: Dispatch<SetStateAction<boolean>>;
};

export function ChatWindow(params: ChatWindowParams) {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const chatHistoryRef = useRef<HTMLDivElement>(null);

  const [messageInput, setMessageInput] = useState("");
  const userContext = useContext(UserContext);

  const stompClient = useStompClient();
  useSubscription("/topic/chat-history", (message) => {
    setChatHistory(JSON.parse(message.body).history);
  });

  useEffect(() => {
    fetch("http://localhost:8080/chat-global").then((response) => {
      response.json().then((e) => setChatHistory(e.history));
    });
  }, []);

  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [chatHistory]);

  function sendMessage() {
    if (stompClient && messageInput !== "") {
      const newMessage: ChatMessage = {
        senderName: userContext.userNickName!,
        message: messageInput,
        date: new Date(), // change to Backend soon
      };
      stompClient.publish({
        destination: "/app/new-message",
        body: JSON.stringify(newMessage),
      });
    } else {
      //Handle error
    }
  }

  if (params.showChatWindow) {
    return (
      <div id="chat-window">
        <button
          id="chat-minimize-btn"
          onClick={() => params.setShowChatWindow(false)}
        ></button>
        <div id="chat-history" ref={chatHistoryRef}>
          {chatHistory !== undefined ? (
            chatHistory.map((e) => <p> {e.senderName + ": " + e.message} </p>)
          ) : (
            <></>
          )}
        </div>
        <div id="chat-input">
          <label htmlFor="messageInput">Message</label>
          <input
            id="messageInput"
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.currentTarget.value)}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    );
  } else {
    return <></>;
  }
}
