import { UnoCard } from "../../models/unoCard";

const colors = new Map(
  Object.entries({
    RED: "bg-uno-red",
    BLUE: "bg-uno-blue",
    GREEN: "bg-uno-green",
    YELLOW: "bg-uno-yellow",
    BLACK: "bg-uno-black",
  })
);

const numbers = new Map(
  Object.entries({
    ZERO: "0",
    ONE: "1",
    TWO: "2",
    THREE: "3",
    FOUR: "4",
    FIVE: "5",
    SIX: "6",
    SEVEN: "7",
    EIGHT: "8",
    NINE: "9",
    DRAW_TWO: "+2",
    SKIP: "⦸",
    REVERSE: "↻",
    SELECT_COLOR: "",
    DRAW_FOUR: "+4",
  })
);

export function UnoCardDisplay(card: UnoCard) {
  return (
    <div className="relative bg-uno-white w-28 h-44 rounded-lg flex justify-center items-center">
      <div className=" absolute border-solid border-uno-white border-4 rounded-[100%] w-20 h-40 rotate-[30deg]"></div>
      <div className={`${colors.get(card.color)} w-24 h-40 rounded-lg flex justify-center items-center`}>
        <div className="absolute bottom-3 right-4 drop-shadow-uno-small-text font-bold text-xl border-black border-1 border-solid">
          {numbers.get(card.cardType)}
        </div>
        <div className="absolute top-3 left-4  drop-shadow-uno-small-text font-bold text-xl border-black border-1 border-solid">
          {numbers.get(card.cardType)}
        </div>
        <div className="drop-shadow-uno-large-text font-bold text-[5rem] border-black border-1 border-solid">
          {numbers.get(card.cardType)}
        </div>
      </div>
    </div>
  );
}
