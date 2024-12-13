import { createContext, Dispatch, SetStateAction, useState } from "react";
import "./App.css";
import LandingPage from "./components/landing/LandingPage";
import Lobby from "./components/lobby/Lobby";

type UserContextProviderType = {
  userNickName?: string;
  setUserNickName?: Dispatch<SetStateAction<string>>;
};
export const UserContext = createContext<UserContextProviderType>({});

function App() {
  const [userNickName, setUserNickName] = useState("");
  return (
    <>
      <UserContext.Provider value={{ userNickName, setUserNickName }}>
        <div id="main-content">{userNickName === "" ? <LandingPage /> : <Lobby />}</div>
      </UserContext.Provider>
    </>
  );
}

export default App;
