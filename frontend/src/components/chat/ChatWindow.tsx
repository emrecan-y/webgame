import { FormEvent, useContext, useEffect, useRef, useState } from "react";
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
  }, [chatHistory, showChatWindow]);

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
      {showChatWindow && (
        <div className="bg-violet-400 fixed flex flex-col items-end -translate-y-full rounded rounded-br-none">
          <button className="mr-1 text-black" onClick={() => setShowChatWindow(false)}>
            X
          </button>
          <div ref={chatHistoryRef} className="overflow-y-scroll text-black h-96 px-1 bg-violet-400 w-full">
            {Array.isArray(chatHistory) ? (
              chatHistory.map((e) => (
                <p>
                  <span className="text-violet-950 font-semibold">{e.senderName + ": "}</span>
                  {e.message}
                </p>
              ))
            ) : (
              <></>
            )}
          </div>
          <form className="flex flex-row" onSubmit={(e) => sendMessage(e)}>
            <input
              autoFocus
              className="m-1 w-64 bg-black text-white"
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
          showChatWindow ? " bg-violet-400 p-3 pt-4 rounded-b text-black  " : " bg-violet-800 p-3 rounded text-white"
        }
        onClick={() => setShowChatWindow(!showChatWindow)}
      >
        {props.buttonText}
      </button>
    </>
  );
}
