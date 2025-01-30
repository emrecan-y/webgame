import { FormEvent, useEffect, useRef, useState } from "react";
import { useStompClient, useSubscription } from "react-stomp-hooks";
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
      stompClient.publish({
        destination: props.sendDestination,
        body: messageInput,
      });
      setMessageInput("");
    }
  }

  return (
    <>
      {getShowState(props.buttonText) && (
        <div className="fixed flex -translate-y-full flex-col items-end rounded rounded-br-none bg-game-accent-light">
          <button
            className="mr-1 text-game-main-dark"
            onClick={chatButtonHandler}
          >
            ✖
          </button>
          <div
            ref={chatHistoryRef}
            className="h-96 w-full overflow-y-scroll break-words bg-game-accent-light px-1 text-game-main-dark"
          >
            {Array.isArray(chatHistory) &&
              chatHistory.map((e, index) => (
                <p key={props.buttonText + index} className="w-72">
                  <span className="font-semibold text-violet-950">
                    {e.senderName + ": "}
                  </span>
                  {e.message}
                </p>
              ))}
          </div>
          <form className="flex flex-row" onSubmit={(e) => sendMessage(e)}>
            <input
              autoFocus
              className="m-1 w-64 bg-black px-1 text-game-main-light focus:outline-none focus:ring-0"
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.currentTarget.value)}
            />
            <input
              className="m-1 ml-0 cursor-pointer rounded bg-game-accent-medium p-1"
              type="submit"
              value={"↵"}
            />
          </form>
        </div>
      )}

      <button
        id={props.buttonText}
        className={
          getShowState(props.buttonText)
            ? "rounded-b bg-game-accent-light p-3 pt-4 text-game-main-dark"
            : "relative rounded bg-game-accent-medium p-3 text-game-main-light"
        }
        onClick={chatButtonHandler}
      >
        {props.buttonText} Chat
        {!getShowState(props.buttonText) && hasUnreadMessages && (
          <>
            <div className="absolute right-0.5 top-0 m-0 p-0 text-xs text-red-400">
              ●
            </div>
            <div className="absolute right-0.5 top-0 m-0 animate-ping p-0 text-xs text-red-400">
              ●
            </div>
          </>
        )}
      </button>
    </>
  );
}
