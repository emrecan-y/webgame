import { motion } from "motion/react";

type InfoPageProps = {
  isError?: boolean;
  message: string;
};

function InfoPage({ isError, message }: InfoPageProps) {
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
            <span className="inline-block h-5 w-5 animate-spin rounded-full border-4 border-game-main-light border-b-transparent"></span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default InfoPage;
