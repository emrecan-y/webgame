import { useContext, useState } from "react";
import { UserContext } from "../../App";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const [nickName, setNickname] = useState("");
  const userContext = useContext(UserContext);
  const navigate = useNavigate();

  function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    userContext.setUserNickName!(nickName);
    navigate("/lobbies");
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

export default LandingPage;
