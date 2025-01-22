import { UnoCard, UnoCardColor } from "./unoCard";

export type UnoGameState = {
  users: string[];
  currentUserIndex: number;
  userCards: UnoCard[];
  isDrawPossible: boolean;

  direction: Direction;
  centerCard: UnoCard;
  colorOverride: UnoCardColor;
  drawCount: number;
};

export type Direction = "CLOCKWISE" | "ANTI_CLOCKWISE";
