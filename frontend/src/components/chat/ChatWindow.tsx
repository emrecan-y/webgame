import { FormEvent, useContext, useEffect, useRef, useState } from "react";
import { useStompClient, useSubscription } from "react-stomp-hooks";
import { UserContext } from "../../App";
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
        <div className="bg-violet-400 fixed flex flex-col items-end -translate-y-full rounded rounded-br-none">
          <button className="mr-1 text-black" onClick={chatButtonHandler}>
            X
          </button>
          <div ref={chatHistoryRef} className=" overflow-y-scroll text-black h-96 px-1 bg-violet-400 w-full">
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
              className="m-1 w-64 bg-black text-white focus:outline-none focus:ring-0 px-1"
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.currentTarget.value)}
            />
            <input className="m-1 ml-0 cursor-pointer bg-violet-800 rounded p-1" type="submit" value={"↵"} />
          </form>
        </div>
      )}

      <button
        id={props.buttonText}
        className={
          getShowState(props.buttonText)
            ? "bg-violet-400 p-3 pt-4 rounded-b text-black"
            : "bg-violet-800 p-3 rounded text-white relative"
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
