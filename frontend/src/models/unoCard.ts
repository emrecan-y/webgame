export type UnoCard = {
  id: number;
  color: UnoCardColor;
  cardType: UnoCardType;
};

export type UnoCardColor = "RED" | "BLUE" | "GREEN" | "YELLOW" | "BLACK";
export type UnoCardType =
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
