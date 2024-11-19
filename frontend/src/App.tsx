import { createContext, Dispatch, SetStateAction, useState } from "react";
import "./App.css";
import Chat from "./components/chat/Chat";
import { LandingPage } from "./components/landing/Landingpage";

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
        <div id="main-content">
          {userNickName === "" ? <LandingPage /> : <Chat />}
        </div>
      </UserContext.Provider>
    </>
  );
}

export default App;
