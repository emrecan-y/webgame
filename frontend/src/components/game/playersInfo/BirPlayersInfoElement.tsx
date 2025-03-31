import { BirUser } from "../../../models/birGameState";
import shadow from "../../../assets/avatar-shadow.svg";
import BirCardFan from "./BirCardFan";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

type BirPlayersInfoElementProps = {
  user: BirUser;
  currentUserName: string;
};

function BirPlayersInfoElement({
  user,
  currentUserName,
}: BirPlayersInfoElementProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (user.hasAttemptedToDeclareBir) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 1500);

      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [user.hasAttemptedToDeclareBir]);

  return (
    <div
      key={`player-info-${user.name}`}
      className={`rounded p-1 text-game-main-dark transition-transform ${currentUserName === user.name && "animate-bounce-subtle"}`}
    >
      <div className="relative flex h-28 w-max flex-col items-center justify-between sm:h-40">
        <img className="w-16 sm:w-20" src={shadow} alt="no" />
        <AnimatePresence>
          {isVisible && (
            <motion.p
              className="absolute -top-[4%] left-[56%] w-fit rounded-full bg-game-accent-medium p-2 text-game-main-light"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{
                opacity: 0,
                x: 10,
                y: -15,
                transition: { duration: 0.5 },
              }}
            >
              BİR!
              <span className="absolute -left-0.5 bottom-0 h-0 w-3 rotate-45 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-game-accent-medium"></span>
            </motion.p>
          )}
        </AnimatePresence>
        <div className="absolute top-7 sm:top-8">
          <BirCardFan cardCount={user.cardCount} />
        </div>
        <p className="rounded-md bg-white p-1 text-xs sm:my-1.5 sm:text-sm">
          {user.name}
        </p>
      </div>
    </div>
  );
}

export default BirPlayersInfoElement;
