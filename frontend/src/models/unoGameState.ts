import { UnoCard } from "./unoCard";

export type UnoGameState = {
  users: string[];
  currentUserIndex: number;
  userCards: UnoCard[];

  direction: Direction;
  centerCard: UnoCard;
};

export type Direction = "CLOCKWISE" | "ANTI_CLOCKWISE";
