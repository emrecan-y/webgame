import LandingPage from "./landing/LandingPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./Layout";
import LobbyList from "./lobby/LobbyList";
import ConnectionError from "./error/ConnectionError";
import { UserContextProvider } from "./context/UserContext";
import GameWindow from "./game/GameWindow";

function App() {
  return (
    <UserContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<LandingPage />} />
            <Route path="/lobbies" element={<LobbyList />} />
            <Route path="/game" element={<GameWindow />} />
          </Route>
          <Route path="/connection-error" element={<ConnectionError />} />
        </Routes>
      </BrowserRouter>
    </UserContextProvider>
  );
}

export default App;
