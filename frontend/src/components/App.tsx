import { createContext, Dispatch, SetStateAction, useState } from "react";
import LandingPage from "./landing/LandingPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./Layout";
import LobbyList from "./lobby/LobbyList";
import ConnectionError from "./error/ConnectionError";

type UserContextProviderType = {
  userNickName?: string;
  setUserNickName?: Dispatch<SetStateAction<string>>;
  userLobbyId?: number;
  setUserLobbyId?: Dispatch<SetStateAction<number>>;
};

export const UserContext = createContext<UserContextProviderType>({});

function App() {
  const [userNickName, setUserNickName] = useState("");
  const [userLobbyId, setUserLobbyId] = useState(-1);

  return (
    <UserContext.Provider value={{ userNickName, setUserNickName, userLobbyId, setUserLobbyId }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<LandingPage />} />
            <Route path="/lobbies" element={<LobbyList />} />
          </Route>
          <Route path="/connection-error" element={<ConnectionError />} />
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
