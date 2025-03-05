import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useSubscription } from "react-stomp-hooks";
import { InfoPopUp } from "../../models/infoPopUp";

export function InfoPopUpContainer() {
  const [infoPopUps, setInfoPopUps] = useState<InfoPopUp[]>([]);

  useSubscription("/user/queue/info-pop-up", (message) => {
    const newInfoPopUp: InfoPopUp = JSON.parse(message.body);
    setInfoPopUps((prevInfoPopUps) => [...prevInfoPopUps, newInfoPopUp]);
    setTimeout(() => {
      setInfoPopUps((prevInfoPopUps) =>
        prevInfoPopUps.filter((infoPopUp) => infoPopUp.id !== newInfoPopUp.id),
      );
    }, 2000);
  });

  return (
    <div className="fixed top-0 z-50 flex w-screen flex-col items-center justify-center">
      <AnimatePresence>
        {infoPopUps?.map((infoPopUp) => (
          <motion.div
            className={infoPopUp.isError ? "bg-red-600" : "bg-slate-600"}
            key={infoPopUp.id}
            initial={{ opacity: 0, height: 0 }}
            exit={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ type: "spring" }}
          >
            {infoPopUp.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
