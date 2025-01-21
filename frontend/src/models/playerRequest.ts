import { UnoCardColor } from "./unoCard";

export type PlayerRequest = {
  nickName?: string;

  lobbyId?: number;
  lobbySize?: number;
  lobbyPassword?: string;

  cardId?: number;
  pickedColor?: UnoCardColor;
};
