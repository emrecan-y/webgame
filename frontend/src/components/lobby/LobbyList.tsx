import { useContext, useEffect, useRef, useState } from "react";
import { useStompClient, useSubscription } from "react-stomp-hooks";
import { Lobby } from "../../models/lobby";
import LobbyCreation from "./LobbyCreation";
import LobbyListEntry from "./LobbyListEntry";
import { UserContext } from "../context/UserContext";
import { AnimatePresence, motion } from "motion/react";
import MotionButton from "../ui/MotionButton";

function LobbyList() {
  const [lobbyList, setLobbyList] = useState<Lobby[]>([]);
  const [showCreationWindow, setShowCreationWindow] = useState(false);

  const userContext = useContext(UserContext);
  const stompClient = useStompClient();

  const lobbyListRef = useRef<HTMLDivElement>(null);

  // listen to backend for current lobbyId
  useSubscription("/user/queue/lobby/lobby-id", (message) => {
    userContext.setUserLobbyId(parseInt(message.body));
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

  return (
    <div
      className="relative flex h-dvh w-full flex-col items-center overflow-y-auto px-2 py-6 text-sm sm:text-base"
      ref={lobbyListRef}
    >
      <div className="fixed bottom-0.5 z-10 flex w-full flex-col drop-shadow-[0px_0px_25px_#000000] sm:bottom-4 sm:items-center sm:bg-transparent">
        <MotionButton
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "easeInOut" }}
          className="m-0.5 h-11 w-fit rounded bg-game-accent-medium px-2 py-1 sm:m-auto sm:w-full sm:max-w-96"
          onClick={() => setShowCreationWindow(true)}
        >
          + Create Lobby
        </MotionButton>
      </div>
      <div className="w-full max-w-80 sm:max-w-96">
        <AnimatePresence>
          {lobbyList?.map((e) => (
            <motion.div
              key={`list-entry-${e.id}`}
              className="w-full"
              initial={{ opacity: 0, height: 0 }}
              exit={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ type: "easeInOut" }}
            >
              <LobbyListEntry lobby={e} />
            </motion.div>
          ))}
        </AnimatePresence>
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
