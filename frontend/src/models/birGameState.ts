import { BirCard, BirCardColor } from "./birCard";

export type BirGameState = {
  users: BirUser[];
  currentUser: string;

  userCards: BirCard[];

  direction: Direction;
  centerCard: BirCard;
  isDrawPossible: boolean;
  colorOverride: BirCardColor;
  drawCount: number;
  isGameOver: boolean;
};

export type Direction = "CLOCKWISE" | "ANTI_CLOCKWISE";

export type BirUser = {
  name: string;
  cardCount: number;
  winCount: number;
  hasAttemptedToDeclareBir: boolean;
};
