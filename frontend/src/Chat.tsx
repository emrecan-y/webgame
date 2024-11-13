import { useState } from "react";

import {
  StompSessionProvider,
  useStompClient,
  useSubscription,
} from "react-stomp-hooks";

function Chat() {
  return (
    //Initialize Stomp connection, will use SockJS for http(s) and WebSocket for ws(s)
    //The Connection can be used by all child components via the hooks or hocs.
    <StompSessionProvider
      url={"ws://localhost:8080/chat"}
      //All options supported by @stomp/stompjs can be used here
    >
      <SubscribingComponent />
      <SendingMessages />
    </StompSessionProvider>
  );
}

type ChatMessage = {
  senderName: string;
  message: string;
};

function SubscribingComponent() {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  useSubscription("/topic/chat-history", (message) => {
    console.log(message.body);
    console.log();
    setChatHistory(JSON.parse(message.body).history);
  });

  if (chatHistory !== undefined) {
    return (
      <>
        {chatHistory.map((e) => (
          <p> {e.senderName + ": " + e.message} </p>
        ))}
      </>
    );
  } else {
    return "History is empty";
  }
}

export function SendingMessages() {
  //Get Instance of StompClient
  //This is the StompCLient from @stomp/stompjs
  //Note: This will be undefined if the client is currently not connected
  const [senderName, setSenderName] = useState("");
  const [messageInput, setMessageInput] = useState("");

  const stompClient = useStompClient();

  const sendMessage = () => {
    if (stompClient && senderName !== "" && messageInput !== "") {
      const newMessage: ChatMessage = {
        senderName: senderName,
        message: messageInput,
      };
      stompClient.publish({
        destination: "/app/new-message",
        body: JSON.stringify(newMessage),
      });
    } else {
      //Handle error
    }
  };

  return (
    <>
      <label htmlFor="senderName">Name</label>
      <input
        id="senderName"
        type="text"
        value={senderName}
        onChange={(e) => setSenderName(e.currentTarget.value)}
      />
      <label htmlFor="messageInput">Message</label>
      <input
        id="messageInput"
        type="text"
        value={messageInput}
        onChange={(e) => setMessageInput(e.currentTarget.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </>
  );
}

export default Chat;
