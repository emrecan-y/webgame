import { useContext, useEffect, useState } from "react";
import { useStompClient, useSubscription } from "react-stomp-hooks";
import { UserContext } from "../context/UserContext";
import { LoginRequest } from "../../models/requests";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import MotionButton from "../ui/MotionButton";

function LandingPage() {
  const [nickName, setNickname] = useState("");
  const [infoText, setInfoText] = useState("");

  const stompClient = useStompClient();
  const { userNickName, setUserNickName } = useContext(UserContext);
  const navigate = useNavigate();

  const maxNameLength = 14;
  const minNameLength = 4;

  useEffect(() => {
    if (userNickName !== "") {
      navigate("/lobbies");
    }
    requestRandomName();
  }, [stompClient]);

  useEffect(() => {
    if (nickName.length > maxNameLength) {
      setInfoText("Please pick a shorter name");
    } else if (nickName.length < minNameLength) {
      setInfoText("Please pick a longer nickname.");
    } else {
      setInfoText("");
    }
  }, [nickName]);

  useSubscription("/user/queue/random-name", (message) => {
    setNickname(message.body);
  });

  function requestRandomName() {
    if (stompClient) {
      stompClient.publish({
        destination: "/app/random-name",
      });
    }
  }

  function tryLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (
      stompClient &&
      nickName.length <= maxNameLength &&
      nickName.length >= minNameLength
    ) {
      const request: LoginRequest = {
        nickName: nickName,
      };
      stompClient.publish({
        destination: "/app/login",
        body: JSON.stringify(request),
      });
    }
  }

  // listen to backend for confirmation on login
  useSubscription("/user/queue/login/user-name", (message) => {
    if (message.body !== "") {
      setUserNickName(message.body);
    } else {
      setInfoText("This name already exists");
    }
  });

  return (
    <motion.div
      className="flex flex-col items-center"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring" }}
    >
      <p className="min-h-6 animate-bounce">{infoText}</p>
      <form
        className="flex w-56 flex-col rounded bg-game-accent-light p-2"
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
    </motion.div>
  );
}

export default LandingPage;
