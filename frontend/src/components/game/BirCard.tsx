import { BirCard, BirCardColor } from "../../models/birCard";

const colors = new Map(
  Object.entries({
    RED: "bg-bir-red",
    BLUE: "bg-bir-blue",
    GREEN: "bg-bir-green",
    YELLOW: "bg-bir-yellow",
    BLACK: "bg-bir-black",
  }),
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
  }),
);

const middleTextElement = (value: string | undefined) => {
  return (
    <>
      <div className="absolute flex h-40 w-20 rotate-[30deg] items-center justify-center rounded-[100%] border-4 border-solid border-bir-white">
        <div className="border-1 rotate-[-30deg] border-solid border-black pb-2 pl-1 text-[3.4rem] font-bold drop-shadow-bir-large-text">
          {value}
        </div>
      </div>
    </>
  );
};

const colorGridElement = (
  <>
    <div className="absolute flex h-40 w-20 rotate-[30deg] flex-wrap rounded-[100%] border-4 border-solid border-bir-white">
      <div className="h-1/2 w-1/2 rounded-tl-[100%] bg-bir-red"></div>
      <div className="h-1/2 w-1/2 rounded-tr-[100%] bg-bir-blue"></div>
      <div className="h-1/2 w-1/2 rounded-bl-[100%] bg-bir-green"></div>
      <div className="h-1/2 w-1/2 rounded-br-[100%] bg-bir-yellow"></div>
    </div>
  </>
);

export function BirCardFront(
  card: Omit<BirCard, "id"> & { colorOverride?: BirCardColor },
) {
  const color = card.colorOverride || card.color;

  return (
    <div className="relative flex h-44 w-28 select-none items-center justify-center rounded-lg bg-bir-white font-cabin">
      {card.color === "BLACK"
        ? colorGridElement
        : middleTextElement(numbers.get(card.cardType))}
      <div
        className={`${colors.get(color)} flex h-40 w-24 items-center justify-center rounded-lg`}
      >
        <div className="border-1 absolute bottom-2 right-3 rotate-180 border-solid border-black text-xl font-bold drop-shadow-bir-small-text">
          {numbers.get(card.cardType)}
        </div>
        <div className="border-1 absolute left-3 top-2 border-solid border-black text-xl font-bold drop-shadow-bir-small-text">
          {numbers.get(card.cardType)}
        </div>
      </div>
    </div>
  );
}

export function BirCardBack() {
  return (
    <div className="relative flex h-44 w-28 select-none items-center justify-center rounded-lg bg-bir-white font-cabin">
      <div className="absolute flex h-40 w-20 rotate-[30deg] items-center justify-center rounded-[100%] border-4 border-solid border-bir-white bg-game-accent-medium">
        <div className="border-1 rotate-[-50deg] pl-1 text-[2rem] font-bold text-bir-yellow drop-shadow-bir-large-text">
          BİR
        </div>
      </div>
      <div
        className={`${colors.get("BLACK")} flex h-40 w-24 items-center justify-center rounded-lg`}
      ></div>
    </div>
  );
}
