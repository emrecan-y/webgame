import { useContext, useEffect, useRef, useState } from "react";
import { useStompClient, useSubscription } from "react-stomp-hooks";
import { UserContext } from "../../App";
import { ChatMessage } from "../../models/chat";

export type ChatWindowProps = {
  buttonText: string;
  receiveDestinationTopic: string;
  receiveDestinationUser: string;
  sendDestination: string;
  connectDestination: string;
};

export function ChatWindow(props: ChatWindowProps) {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const chatHistoryRef = useRef<HTMLDivElement>(null);

  const [messageInput, setMessageInput] = useState("");
  const userContext = useContext(UserContext);
  const [showChatWindow, setShowChatWindow] = useState(false);

  const stompClient = useStompClient();

  useSubscription(props.receiveDestinationTopic, (message) => {
    setChatHistory(JSON.parse(message.body).history);
  });

  useSubscription(props.receiveDestinationUser, (message) => {
    setChatHistory(JSON.parse(message.body).history);
  });

  useEffect(() => {
    if (stompClient) {
      stompClient.publish({
        destination: props.connectDestination,
      });
    }
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
        destination: props.sendDestination,
        body: JSON.stringify(newMessage),
      });
    } else {
      //Handle error
    }
  }

  return (
    <>
      {showChatWindow && (
        <div className="bg-violet-800 ">
          <button onClick={() => setShowChatWindow(false)}></button>
          <div ref={chatHistoryRef}>
            {Array.isArray(chatHistory) ? chatHistory.map((e) => <p> {e.senderName + ": " + e.message} </p>) : <></>}
          </div>
          <div>
            <label htmlFor="messageInput">Message</label>
            <input type="text" value={messageInput} onChange={(e) => setMessageInput(e.currentTarget.value)} />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
      <button
        id={props.buttonText}
        className="bg-violet-800 p-3 rounded-tl-xl "
        onClick={() => setShowChatWindow(!showChatWindow)}
      >
        {props.buttonText}
      </button>
    </>
  );
}
