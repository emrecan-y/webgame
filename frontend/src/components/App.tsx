import LandingPage from "./general/LandingPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./Layout";
import LobbyList from "./lobby/LobbyList";
import ConnectionError from "./general/ConnectionError";
import { UserContextProvider } from "./context/UserContext";
import GameWindow from "./game/GameWindow";
import { AnimatedBackground } from "./general/AnimatedBackground";

function App() {
  return (
    <UserContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route
              index
              element={
                <>
                  <LandingPage /> <AnimatedBackground />
                </>
              }
            />
            <Route
              path="/lobbies"
              element={
                <>
                  <LobbyList /> <AnimatedBackground />
                </>
              }
            />
            <Route
              path="/game"
              element={
                <>
                  <GameWindow />
                </>
              }
            />
            <Route
              path="/connection-error"
              element={
                <>
                  <ConnectionError /> <AnimatedBackground />
                </>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
      <div className="absolute left-0 top-0 -z-50 h-full min-h-dvh w-full bg-game-main-dark"></div>
    </UserContextProvider>
  );
}

export default App;
