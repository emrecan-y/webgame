import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../App";
import { getRandomName } from "../../api";
import { useStompClient, useSubscription } from "react-stomp-hooks";

function LandingPage() {
  const [nickName, setNickname] = useState("");
  const [infoText, setInfoText] = useState("");

  const userContext = useContext(UserContext);
  const stompClient = useStompClient();

  useEffect(() => {
    getRandomName().then((randomName) => setNickname(randomName));
  }, []);

  useEffect(() => {
    if (nickName !== "") {
      setInfoText("");
    }
  }, [nickName]);

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
    console.log(message.body);
    if (message.body !== "") {
      userContext.setUserNickName!(message.body);
    } else {
      setInfoText("This name already exists");
    }
  });

  function updateRandomName() {
    getRandomName().then((randomName) => setNickname(randomName));
  }

  return (
    <div className="flex flex-col items-center">
      <p className="min-h-6 animate-bounce">{infoText}</p>
      <form className="flex flex-col bg-violet-400 p-2  rounded" onSubmit={(e) => tryLogin(e)}>
        <div className="bg-violet-800 p-1 flex flex-col rounded">
          <label className="pl-1" htmlFor="nickname">
            Nickname
          </label>
          <input
            className="bg-gray-950 pl-1"
            type="text"
            name="nickname"
            id="nickname"
            onChange={(e) => setNickname(e.currentTarget.value)}
            value={nickName}
          />
        </div>
        <div className=" flex justify-between">
          <input
            className="py-1 px-4 mt-3 bg-violet-800 rounded"
            type="button"
            onClick={updateRandomName}
            value="Generate"
          />
          <input className="py-1 px-4 mt-3 bg-violet-800 rounded" type="submit" value="Continue" />
        </div>
      </form>
    </div>
  );
}

export default LandingPage;
