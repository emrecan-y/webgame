import { UnoCard, UnoCardColor } from "./unoCard";

export type UnoGameState = {
  users: UnoUser[];
  currentUser: string;

  userCards: UnoCard[];

  direction: Direction;
  centerCard: UnoCard;
  isDrawPossible: boolean;
  colorOverride: UnoCardColor;
  drawCount: number;
  isGameOver: boolean;
};

export type Direction = "CLOCKWISE" | "ANTI_CLOCKWISE";

export type UnoUser = {
  name: string;
  cardCount: number;
  winCount: number;
};
