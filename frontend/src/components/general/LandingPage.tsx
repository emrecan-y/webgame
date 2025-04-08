import { useContext, useEffect, useMemo, useState } from "react";
import { useStompClient, useSubscription } from "react-stomp-hooks";
import { UserContext } from "../context/UserContext";
import { LoginRequest } from "../../models/requests";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import MotionButton from "../ui/MotionButton";
import { ProfanityFilterContext } from "../context/ProfanityFilterContext";
import PrivacyPolicy from "./PrivacyPolicy";
import InfoPage from "../info/InfoPage";

function LandingPage() {
  const [isConnected, setIsConnected] = useState(false);
  const [nickName, setNickname] = useState("");
  const [infoText, setInfoText] = useState("");

  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);

  const stompClient = useStompClient();
  const { userNickName, setUserNickName } = useContext(UserContext);
  const { censor } = useContext(ProfanityFilterContext);
  const navigate = useNavigate();

  const maxNameLength = 14;
  const minNameLength = 4;

  useEffect(() => {
    if (userNickName !== "") {
      navigate("/lobbies");
    } else {
      requestRandomName();
    }
  }, [stompClient]);

  useSubscription("/user/queue/random-name", (message) => {
    setNickname(message.body);
    setIsConnected(true);
  });

  useSubscription("/user/queue/login/user-name", (message) => {
    if (message.body !== "") {
      setUserNickName(message.body);
    }
  });

  const nameIsValid = useMemo(() => {
    if (!startsWithLetter(nickName)) {
      setInfoText("Please begin with a letter.");
    } else if (nickName.length < minNameLength) {
      setInfoText("Please pick a longer nickname.");
    } else if (!containsOnlyLettersAndNumbers(nickName)) {
      setInfoText("No special characters allowed.");
    } else if (nickName.length > maxNameLength) {
      setInfoText("Please pick a shorter name.");
    } else {
      setInfoText("");
      return true;
    }
    return false;
  }, [nickName]);

  function tryLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (stompClient && nameIsValid) {
      const request: LoginRequest = {
        nickName: censor(nickName),
      };

      stompClient.publish({
        destination: "/app/login",
        body: JSON.stringify(request),
      });
    }
  }

  function requestRandomName() {
    if (stompClient) {
      stompClient.publish({
        destination: "/app/random-name",
      });
    }
  }

  function containsOnlyLettersAndNumbers(input: string) {
    const regex = new RegExp("^[a-zA-Z0-9]*$");
    return regex.test(input);
  }

  function startsWithLetter(input: string) {
    const regex = new RegExp("^[a-zA-Z].*$");
    return regex.test(input);
  }
  if (isConnected) {
    return (
      <motion.div
        className="relative flex flex-col items-center"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring" }}
      >
        {showPrivacyPolicy && (
          <PrivacyPolicy
            setShowPrivacyPolicy={setShowPrivacyPolicy}
          ></PrivacyPolicy>
        )}
        {infoText !== "" && (
          <p className="absolute -top-10 w-max animate-bounce rounded border border-game-accent-light bg-game-accent-medium p-2 text-game-main-light">
            {infoText}
          </p>
        )}
        <form
          className="flex w-60 flex-col rounded bg-game-accent-light p-2"
          onSubmit={(e) => tryLogin(e)}
        >
          <div className="flex flex-col rounded bg-game-accent-medium p-1">
            <label className="pl-1" htmlFor="nickname">
              Nickname
            </label>
            <input
              className="w-full bg-game-main-dark pl-1"
              type="text"
              name="nickname"
              id="nickname"
              onChange={(e) => setNickname(e.currentTarget.value)}
              value={nickName}
            />
          </div>
          <div className="flex justify-between">
            <MotionButton
              className="mt-3 rounded bg-game-accent-medium px-4 py-1"
              onClick={requestRandomName}
            >
              Generate
            </MotionButton>
            <MotionButton
              className="mt-3 rounded bg-game-accent-medium px-4 py-1"
              type="submit"
            >
              Continue
            </MotionButton>
          </div>
        </form>
        <p className="absolute top-28 mt-2 w-56 text-center text-xs text-game-main-light">
          By continuing, you confirm that you have read and understood the{" "}
          <span className="">
            <button
              className="underline hover:text-game-accent-light"
              type="button"
              onClick={() => setShowPrivacyPolicy(true)}
            >
              Privacy Policy
            </button>
          </span>
          .
        </p>
      </motion.div>
    );
  } else {
    return <InfoPage message="Connecting to the server." />;
  }
}

export default LandingPage;
