import { motion } from "motion/react";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

type LobbyListEntryLabelProps = {
  lobbyUser: string;
};

function LobbyListEntryLabel({ lobbyUser }: LobbyListEntryLabelProps) {
  const { userNickName } = useContext(UserContext);
  if (lobbyUser) {
    return (
      <motion.p
        key={`lobby-list-label-${lobbyUser}`}
        initial={{ opacity: 0, left: "15px" }}
        exit={{ opacity: 0, left: "-15px" }}
        animate={{ opacity: 1, left: 0 }}
        transition={{ type: "easeIn" }}
        className={` ${
          lobbyUser === userNickName
            ? "text-game-accent-light"
            : "text-game-main-light"
        } relative`}
      >
        {lobbyUser}
      </motion.p>
    );
  } else {
    return (
      <motion.p
        className="relative text-game-main-medium"
        initial={{ opacity: 0, left: "-15px", zIndex: "-1000" }}
        exit={{ opacity: 0, left: "15px", zIndex: "-1000" }}
        animate={{ opacity: 1, left: 0, zIndex: "0" }}
        transition={{ type: "easeIn" }}
      >
        Free
      </motion.p>
    );
  }
}

export default LobbyListEntryLabel;
