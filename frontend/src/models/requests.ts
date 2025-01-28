import { UnoCardColor } from "./unoCard";

export type LoginRequest = {
  nickName: string;
};

export type LobbyCreateRequest = {
  lobbySize: number;
  lobbyPassword: string;
};

export type GeneralPlayerRequest = {
  lobbyId: number;
  lobbyPassword: string;
  nickName: string;
};

export type PlayerMakeMoveRequest = GeneralPlayerRequest & {
  cardId: number;
  pickedColor: UnoCardColor;
};
