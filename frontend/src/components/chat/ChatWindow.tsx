import { FormEvent, useContext, useEffect, useRef, useState } from "react";
import { useStompClient, useSubscription } from "react-stomp-hooks";
import { UserContext } from "../App";
import { ChatMessage } from "../../models/chat";
import { useChatStore } from "./ChatStore";

type ChatWindowProps = {
  buttonText: string;
  receiveDestinationTopic: string;
  receiveDestinationUser: string;
  sendDestination: string;
  connectDestination: string;
};

export function ChatWindow(props: ChatWindowProps) {
  const userContext = useContext(UserContext);

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const chatHistoryRef = useRef<HTMLDivElement>(null);

  const [messageInput, setMessageInput] = useState("");
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);

  const stompClient = useStompClient();

  const { setShowChat, getShowState, removeChat } = useChatStore();

  useSubscription(props.receiveDestinationTopic, (message) => {
    setChatHistory(JSON.parse(message.body).history);
    if (!getShowState(props.buttonText)) {
      setHasUnreadMessages(true);
    }
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
    setShowChat(props.buttonText, false);

    return () => {
      removeChat(props.buttonText);
    };
  }, []);

  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [chatHistory, getShowState(props.buttonText)]);

  function chatButtonHandler() {
    setShowChat(props.buttonText, !getShowState(props.buttonText));
    setHasUnreadMessages(false);
  }

  function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
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
      setMessageInput("");
    } else {
      //Handle error
    }
  }

  return (
    <>
      {getShowState(props.buttonText) && (
        <div className="bg-game-accent-light fixed flex flex-col items-end -translate-y-full rounded rounded-br-none">
          <button className="mr-1 text-game-main-dark" onClick={chatButtonHandler}>
            ✖
          </button>
          <div
            ref={chatHistoryRef}
            className=" overflow-y-scroll text-game-main-dark h-96 px-1 bg-game-accent-light w-full"
          >
            {Array.isArray(chatHistory) &&
              chatHistory.map((e, index) => (
                <p key={props.buttonText + index}>
                  <span className="text-violet-950 font-semibold">{e.senderName + ": "}</span>
                  {e.message}
                </p>
              ))}
          </div>
          <form className="flex flex-row" onSubmit={(e) => sendMessage(e)}>
            <input
              autoFocus
              className="m-1 w-64 bg-black text-game-main-light focus:outline-none focus:ring-0 px-1"
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.currentTarget.value)}
            />
            <input className="m-1 ml-0 cursor-pointer bg-game-accent-medium rounded p-1" type="submit" value={"↵"} />
          </form>
        </div>
      )}

      <button
        id={props.buttonText}
        className={
          getShowState(props.buttonText)
            ? "bg-game-accent-light p-3 pt-4 rounded-b text-game-main-dark"
            : "bg-game-accent-medium p-3 rounded text-game-main-light relative"
        }
        onClick={chatButtonHandler}
      >
        {props.buttonText} Chat
        {!getShowState(props.buttonText) && hasUnreadMessages && (
          <>
            <div className="absolute top-0 right-0.5 p-0 m-0 text-red-400 text-xs">●</div>
            <div className="absolute top-0 right-0.5 p-0 m-0 text-red-400 text-xs animate-ping">●</div>
          </>
        )}
      </button>
    </>
  );
}
