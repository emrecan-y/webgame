import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useSubscription } from "react-stomp-hooks";
import { InfoPopUp } from "../../models/infoPopUp";

function InfoPopUpContainer() {
  const [infoPopUps, setInfoPopUps] = useState<InfoPopUp[]>([]);

  const durationInSeconds = 4;

  useSubscription("/user/queue/info-pop-up", (message) => {
    const newInfoPopUp: InfoPopUp = JSON.parse(message.body);
    setInfoPopUps((prevInfoPopUps) => [newInfoPopUp, ...prevInfoPopUps]);
    setTimeout(() => {
      setInfoPopUps((prevInfoPopUps) =>
        prevInfoPopUps.filter((infoPopUp) => infoPopUp.id !== newInfoPopUp.id),
      );
    }, durationInSeconds * 1000);
  });

  return (
    <div className="pointer-events-none fixed top-1 z-50 flex w-screen flex-col items-center justify-start gap-1">
      <AnimatePresence>
        {infoPopUps?.map((infoPopUp) => (
          <motion.div
            key={infoPopUp.id}
            initial={{ opacity: 0, height: 0 }}
            exit={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ type: "spring" }}
            layout
          >
            <div
              className={`relative rounded p-1.5 ${infoPopUp.isError ? "bg-bir-red-light" : "bg-game-accent-light"}`}
            >
              <div
                className={`w-72 rounded p-1 text-game-main-light ${infoPopUp.isError ? "bg-bir-red" : "bg-game-accent-medium"}`}
              >
                <p className="text-">
                  {infoPopUp.isError ? "Error!" : "Info"}{" "}
                </p>
                <p className="bg-game-main-dark">{infoPopUp.message}</p>
              </div>
              <motion.div
                className="absolute bottom-0 left-0 h-1 rounded-bl rounded-br bg-game-main-light"
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ type: "linear", duration: durationInSeconds }}
                layout
              ></motion.div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default InfoPopUpContainer;
