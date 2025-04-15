import { motion } from "motion/react";
import { useEffect } from "react";
import { useStompClient } from "react-stomp-hooks";

type InfoPageProps = {
  isError?: boolean;
  message: string;
  autoRenewConnection?: boolean;
};

function InfoPage({ isError, message, autoRenewConnection }: InfoPageProps) {
  const stompClient = useStompClient();

  // After 5s renew connection every 3s
  useEffect(() => {
    if (autoRenewConnection && stompClient) {
      let intervalId: number;
      const timeoutId = setTimeout(() => {
        stompClient.forceDisconnect();

        intervalId = setInterval(() => {
          stompClient.forceDisconnect();
        }, 3000);
      }, 5000);

      return () => {
        clearTimeout(timeoutId);
        if (intervalId) clearInterval(intervalId);
      };
    }
  }, [autoRenewConnection, stompClient]);

  return (
    <div className="select-non max-w-full animate-bounce-subtle px-2">
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        exit={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        transition={{ type: "easeInOut" }}
        layout
      >
        <div
          className={`relative rounded p-1.5 ${isError ? "bg-bir-red-light" : "bg-game-accent-light"}`}
        >
          <div
            className={`rounded p-1 text-game-main-light ${isError ? "bg-bir-red" : "bg-game-accent-medium"}`}
          >
            <p className="text-">{isError ? "Error!" : "Info"} </p>
            <p className="bg-game-main-dark">{message}</p>
          </div>
          <div
            className={`mt-2 flex items-center justify-center gap-1 rounded p-1 text-game-main-light ${isError ? "bg-bir-red" : "bg-game-accent-medium"}`}
          >
            <h1>Please wait</h1>
            <span className="inline-block h-5 w-5 animate-spin rounded-full border-4 border-game-main-light border-b-game-main-medium"></span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default InfoPage;
