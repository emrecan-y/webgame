import LandingPage from "./landing/LandingPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./Layout";
import LobbyList from "./lobby/LobbyList";
import ConnectionError from "./error/ConnectionError";
import { UserContextProvider } from "./context/UserContext";
import GameWindow from "./game/GameWindow";
import Chat from "./chat/Chat";
import { AnimatedBackground } from "./landing/AnimatedBackground";

function App() {
  return (
    <UserContextProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Layout />
                <Chat />
              </>
            }
          >
            <Route
              index
              element={
                <>
                  <LandingPage />
                  <AnimatedBackground />
                </>
              }
            />
            <Route
              path="/lobbies"
              element={
                <>
                  <LobbyList />
                  <AnimatedBackground />
                </>
              }
            />
            <Route path="/game" element={<GameWindow />} />
          </Route>
          <Route
            path="/connection-error"
            element={
              <>
                <ConnectionError />
                <AnimatedBackground />
              </>
            }
          />
        </Routes>
      </BrowserRouter>
      <div className="absolute left-0 top-0 -z-50 h-full w-full bg-game-main-dark"></div>
    </UserContextProvider>
  );
}

export default App;
