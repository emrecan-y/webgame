import { createContext, useState, PropsWithChildren, Dispatch, SetStateAction } from "react";

type UserContextProviderType = {
  userNickName: string;
  setUserNickName: Dispatch<SetStateAction<string>>;
  lobbyPassWord: string;
  setLobbyPassWord: Dispatch<SetStateAction<string>>;
  userLobbyId: number;
  setUserLobbyId: Dispatch<SetStateAction<number>>;
};

export const UserContext = createContext<UserContextProviderType>({
  userNickName: "",
  setUserNickName: () => {},
  lobbyPassWord: "",
  setLobbyPassWord: () => {},
  userLobbyId: -1,
  setUserLobbyId: () => {},
});

export function UserContextProvider({ children }: PropsWithChildren) {
  const [userNickName, setUserNickName] = useState("");
  const [lobbyPassWord, setLobbyPassWord] = useState("");
  const [userLobbyId, setUserLobbyId] = useState(-1);

  return (
    <UserContext.Provider
      value={{ userNickName, setUserNickName, lobbyPassWord, setLobbyPassWord, userLobbyId, setUserLobbyId }}
    >
      {children}
    </UserContext.Provider>
  );
}
