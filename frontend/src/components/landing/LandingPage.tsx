import { useContext, useEffect, useState } from "react";
import { useStompClient, useSubscription } from "react-stomp-hooks";
import { UserContext } from "../context/UserContext";

function LandingPage() {
  const [nickName, setNickname] = useState("");
  const [infoText, setInfoText] = useState("");

  const userContext = useContext(UserContext);
  const stompClient = useStompClient();

  useEffect(() => {
    requestRandomName();
  }, [stompClient]);

  useEffect(() => {
    if (nickName !== "") {
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
    if (nickName === "") {
      setInfoText("Please pick a nickname.");
    } else if (stompClient) {
      stompClient.publish({
        destination: "/app/login",
        body: nickName,
      });
    }
  }

  // listen to backend for confirmation on login
  useSubscription("/user/queue/login/user-name", (message) => {
    if (message.body !== "") {
      userContext.setUserNickName!(message.body);
    } else {
      setInfoText("This name already exists");
    }
  });

  return (
    <div className="flex flex-col items-center">
      <p className="min-h-6 animate-bounce">{infoText}</p>
      <form className="flex flex-col bg-game-accent-light p-2  rounded" onSubmit={(e) => tryLogin(e)}>
        <div className="bg-game-accent-medium p-1 flex flex-col rounded">
          <label className="pl-1" htmlFor="nickname">
            Nickname
          </label>
          <input
            className="bg-game-main-dark pl-1"
            type="text"
            name="nickname"
            id="nickname"
            onChange={(e) => setNickname(e.currentTarget.value)}
            value={nickName}
          />
        </div>
        <div className=" flex justify-between">
          <input
            className="py-1 px-4 mt-3 bg-game-accent-medium rounded"
            type="button"
            onClick={requestRandomName}
            value="Generate"
          />
          <input className="py-1 px-4 mt-3 bg-game-accent-medium rounded" type="submit" value="Continue" />
        </div>
      </form>
    </div>
  );
}

export default LandingPage;
