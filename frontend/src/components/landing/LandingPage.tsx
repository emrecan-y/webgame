import { useContext, useState } from "react";
import { UserContext } from "../../App";
import "./LandingPage.css";

export function LandingPage() {
  const [nickName, setNickname] = useState("");
  const userContext = useContext(UserContext);

  function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    userContext.setUserNickName!(nickName);
  }

  return (
    <div id="landing-window">
      <form onSubmit={(e) => login(e)}>
        <label htmlFor="nickname">Nickname</label>
        <input
          type="text"
          name="nickname"
          id="nickname"
          onChange={(e) => setNickname(e.currentTarget.value)}
          value={nickName}
        />
        <input type="submit" value="Start" />
      </form>
    </div>
  );
}
