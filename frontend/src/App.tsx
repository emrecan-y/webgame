import { createContext, Dispatch, SetStateAction, useState } from "react";
import LandingPage from "./components/landing/LandingPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LobbyPage from "./components/lobby/LobbyPage";
import { Layout } from "./Layout";

type UserContextProviderType = {
  userNickName?: string;
  setUserNickName?: Dispatch<SetStateAction<string>>;
};
export const UserContext = createContext<UserContextProviderType>({});

function App() {
  const [userNickName, setUserNickName] = useState("");

  return (
    <UserContext.Provider value={{ userNickName, setUserNickName }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<LandingPage />} />
            <Route path="/lobbies" element={<LobbyPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
