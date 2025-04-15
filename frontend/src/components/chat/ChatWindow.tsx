import {
  FormEvent,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useStompClient, useSubscription } from "react-stomp-hooks";
import { ChatHistory, ChatMessage } from "../../models/chat";
import { useChatStore } from "./ChatStore";
import { AnimatePresence, motion } from "motion/react";
import MotionButton from "../ui/MotionButton";
import { ProfanityFilterContext } from "../context/ProfanityFilterContext";

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
  const [infoText, setInfoText] = useState("");
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);

  const { censor } = useContext(ProfanityFilterContext);
  const stompClient = useStompClient();

  const { setShowChat, getShowState, removeChat, isChatDisabled } =
    useChatStore();

  const minChatMessageLength = 1;
  const maxChatMessageLength = 180;

  useSubscription(props.receiveDestinationTopic, (message) => {
    const { history }: ChatHistory = JSON.parse(message.body);
    setChatHistory((prev) => {
      if (!getShowState(props.buttonText) && history.length > prev.length) {
        setHasUnreadMessages(true);
      }
      return history;
    });
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
  }, [stompClient]);

  useEffect(() => {
    const scrollToBottom = () => {
      if (chatHistoryRef.current) {
        chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
      }
    };
    scrollToBottom();
    window.addEventListener("resize", scrollToBottom);

    return () => {
      window.removeEventListener("resize", scrollToBottom);
    };
  }, [chatHistory, getShowState(props.buttonText)]);

  const isChatMessageValid = useMemo(() => {
    if (messageInput.length < minChatMessageLength) {
      setInfoText("");
    } else if (messageInput.length > maxChatMessageLength) {
      setInfoText("Message is too long.");
    } else {
      setInfoText("");
      return true;
    }
    return false;
  }, [messageInput]);

  const isSendButtonActive = isChatMessageValid && !isChatDisabled;
  const sendButtonTitle = isChatDisabled
    ? "Please wait, your chat has been deactivated."
    : !isChatMessageValid
      ? "Plase enter a valid message."
      : "Send message.";

  function chatButtonHandler() {
    setShowChat(props.buttonText, !getShowState(props.buttonText));
    setHasUnreadMessages(false);
  }

  function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (stompClient && isChatMessageValid && !isChatDisabled) {
      stompClient.publish({
        destination: props.sendDestination,
        body: censor(messageInput),
      });
      setMessageInput("");
    }
  }

  return (
    <>
      <AnimatePresence>
        {getShowState(props.buttonText) && (
          <motion.div
            className="fixed flex h-[28rem] max-h-[calc(100dvh_-_3.5rem)] flex-col items-end rounded rounded-br-none bg-game-accent-light pt-1"
            initial={{ opacity: 0, translateY: "0%" }}
            animate={{ opacity: 1, translateY: "-100%" }}
            exit={{ opacity: 0, translateY: "0%" }}
            transition={{ type: "easeInOut" }}
          >
            <MotionButton
              className="mr-1 text-game-main-dark"
              onClick={chatButtonHandler}
            >
              ✖
            </MotionButton>

            <div
              ref={chatHistoryRef}
              className="flex h-full w-full flex-col overflow-y-scroll break-words bg-game-accent-light px-1 text-game-main-dark"
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
            <form className="relative flex flex-row" onSubmit={sendMessage}>
              <p className="absolute -top-5 w-full bg-game-accent-light pl-1 text-bir-red">
                {infoText}
              </p>
              <input
                autoFocus
                className="m-1 w-64 bg-black px-1 text-game-main-light focus:outline-none focus:ring-0"
                type="text"
                value={messageInput}
                placeholder="Messages delete after 15 minutes."
                onChange={(e) => setMessageInput(e.currentTarget.value)}
              />
              <MotionButton
                className={`m-1 ml-0 w-7 cursor-pointer rounded p-0.5 text-game-main-light ${isSendButtonActive ? "bg-game-accent-medium" : "bg-game-main-medium hover:cursor-default"}`}
                title={sendButtonTitle}
                type="submit"
                disableAnimation={!isSendButtonActive}
              >
                ↵
              </MotionButton>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <MotionButton
        className={
          getShowState(props.buttonText)
            ? "rounded-b bg-game-accent-light p-3 pt-4 text-game-main-dark"
            : "rounded bg-game-accent-medium p-3 text-game-main-light"
        }
        onClick={chatButtonHandler}
        initial={{ translateY: "100%" }}
        animate={{ translateY: "0%" }}
        transition={{ type: "easeInOut" }}
      >
        {props.buttonText}
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
      </MotionButton>
    </>
  );
}
