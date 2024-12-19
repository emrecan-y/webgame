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

  function tryLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (stompClient) {
      stompClient.publish({
        destination: "/app/login",
        body: nickName,
      });
    }
  }

  // listen to backend for confirmation on login
  useSubscription("/user/queue/login/user-name", (message) => {
    userContext.setUserNickName!(message.body);
  });

  function updateRandomName() {
    getRandomName().then((randomName) => setNickname(randomName));
  }

  return (
    <div className="flex flex-col justify-center items-center min-w-full min-h-full ">
      <p className=" min-h-6">{infoText}</p>
      <form className="flex flex-col bg-violet-400 p-2 " onSubmit={(e) => tryLogin(e)}>
        <div className="bg-violet-800 p-1 flex flex-col">
          <label className="" htmlFor="nickname">
            Nickname
          </label>
          <input
            className="bg-gray-950"
            type="text"
            name="nickname"
            id="nickname"
            onChange={(e) => {
              setNickname(e.currentTarget.value);
              setInfoText("");
            }}
            value={nickName}
          />
        </div>
        <div className=" flex justify-between">
          <input className="py-1 px-4 mt-4 bg-violet-800" type="button" onClick={updateRandomName} value="Generate" />
          <input className="py-1 px-4 mt-4 bg-violet-800" type="submit" value="Continue" />
        </div>
      </form>
    </div>
  );
}

export default LandingPage;
