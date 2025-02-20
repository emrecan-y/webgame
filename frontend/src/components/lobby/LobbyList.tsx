import { useContext, useEffect, useRef, useState } from "react";
import { useStompClient, useSubscription } from "react-stomp-hooks";
import { Lobby } from "../../models/lobby";
import LobbyCreation from "./LobbyCreation";
import LobbyListEntry from "./LobbyListEntry";
import { UserContext } from "../context/UserContext";
import { AnimatePresence, motion } from "motion/react";

function LobbyList() {
  const [lobbyList, setLobbyList] = useState<Lobby[]>([]);
  const [showCreationWindow, setShowCreationWindow] = useState(false);

  const userContext = useContext(UserContext);
  const stompClient = useStompClient();

  const [isSticky, setIsSticky] = useState(false);
  const lobbyListRef = useRef<HTMLDivElement>(null);

  // listen to backend for current lobbyId
  useSubscription("/user/queue/lobby/lobby-id", (message) => {
    if (message.body !== "") {
      const newLobbyId = parseInt(message.body);
      if (newLobbyId !== -1) {
        userContext.setUserLobbyId!(parseInt(message.body));
      }
    }
  });

  // listen to backend for current lobbyList from request
  useSubscription("/user/queue/lobby-list", (message) => {
    setLobbyList(JSON.parse(message.body));
  });

  // listen to backend for current lobbyList
  useSubscription("/topic/lobby-list", (message) => {
    setLobbyList(JSON.parse(message.body));
  });

  // request current lobbylist from backend
  useEffect(() => {
    if (stompClient) {
      stompClient.publish({
        destination: "/app/lobby-list",
      });
    }
  }, []);

  function checkForYOverFlow() {
    if (lobbyListRef.current) {
      setIsSticky(
        lobbyListRef.current.clientHeight < lobbyListRef.current.scrollHeight,
      );
    }
  }

  return (
    <div
      className="relative flex h-screen w-full flex-col items-center overflow-y-auto overflow-x-hidden py-6"
      ref={lobbyListRef}
    >
      <AnimatePresence onExitComplete={checkForYOverFlow}>
        {lobbyList?.map((e) => (
          <motion.div
            key={`listEntry${e.id}`}
            className="w-96"
            initial={{ opacity: 0, height: 0 }}
            exit={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ type: "spring" }}
            onAnimationComplete={checkForYOverFlow}
          >
            <LobbyListEntry lobby={e} />
          </motion.div>
        ))}
      </AnimatePresence>

      <div className="sticky bottom-0 mt-4 flex w-96 justify-center">
        <AnimatePresence>
          {isSticky && (
            <motion.div
              initial={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ type: "linear" }}
            >
              <div className="absolute left-0 top-0 z-10 -mt-10 h-6 w-full bg-gradient-to-b from-[#00000000] to-game-main-dark" />
              <div className="absolute left-0 top-0 z-10 -mt-4 h-20 w-full bg-game-main-dark" />
            </motion.div>
          )}
        </AnimatePresence>
        <button
          className="z-20 w-96 rounded bg-game-accent-medium px-2 py-1 transition-transform duration-150 ease-in-out hover:scale-105"
          onClick={() => setShowCreationWindow(true)}
        >
          New Lobby
        </button>
      </div>
      <AnimatePresence>
        {showCreationWindow && (
          <LobbyCreation setShowCreationWindow={setShowCreationWindow} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default LobbyList;
