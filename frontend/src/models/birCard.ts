export type BirCard = {
  id: number;
  color: BirCardColor;
  cardType: BirCardType;
};

export type BirCardColor = "RED" | "BLUE" | "GREEN" | "YELLOW" | "BLACK";
export type BirCardType =
  | "ZERO"
  | "ONE"
  | "TWO"
  | "THREE"
  | "FOUR"
  | "FIVE"
  | "SIX"
  | "SEVEN"
  | "EIGHT"
  | "NINE"
  | "DRAW_TWO"
  | "SKIP"
  | "REVERSE"
  | "SELECT_COLOR"
  | "DRAW_FOUR";
