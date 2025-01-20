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

const middleTextElement = (value: string | undefined) => {
  return (
    <>
      <div className="absolute flex justify-center items-center border-solid border-uno-white border-4 rounded-[100%] w-20 h-40 rotate-[30deg]">
        <div className="pl-1 pb-2 drop-shadow-uno-large-text rotate-[-30deg] font-bold text-[3rem] border-black border-1 border-solid">
          {value}
        </div>
      </div>
    </>
  );
};

const colorGridElement = (
  <>
    <div className="absolute flex flex-wrap border-solid border-uno-white border-4 rounded-[100%] w-20 h-40 rotate-[30deg]">
      <div className="w-1/2 h-1/2 bg-uno-red rounded-tl-[100%]"></div>
      <div className="w-1/2 h-1/2 bg-uno-blue rounded-tr-[100%]"></div>
      <div className="w-1/2 h-1/2 bg-uno-green rounded-bl-[100%]"></div>
      <div className="w-1/2 h-1/2 bg-uno-yellow rounded-br-[100%]"></div>
    </div>
  </>
);

export function UnoCardDisplay(card: UnoCard) {
  return (
    <div className="relative select-none bg-uno-white w-28 h-44 rounded-lg flex justify-center items-center hover:scale-110 transition-transform">
      {card.color === "BLACK" ? colorGridElement : middleTextElement(numbers.get(card.cardType))}
      <div className={`${colors.get(card.color)} w-24 h-40 rounded-lg flex justify-center items-center`}>
        <div className="absolute bottom-2 right-3 rotate-180 drop-shadow-uno-small-text font-bold text-xl border-black border-1 border-solid">
          {numbers.get(card.cardType)}
        </div>
        <div className="absolute top-2 left-3  drop-shadow-uno-small-text font-bold text-xl border-black border-1 border-solid">
          {numbers.get(card.cardType)}
        </div>
      </div>
    </div>
  );
}
