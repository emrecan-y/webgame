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
      <div className="border-bir-white absolute flex h-40 w-20 rotate-[30deg] items-center justify-center rounded-[100%] border-4 border-solid">
        <div className="border-1 drop-shadow-bir-large-text rotate-[-30deg] border-solid border-black pb-2 pl-1 text-[3.4rem] font-bold">
          {value}
        </div>
      </div>
    </>
  );
};

const colorGridElement = (
  <>
    <div className="border-bir-white absolute flex h-40 w-20 rotate-[30deg] flex-wrap rounded-[100%] border-4 border-solid">
      <div className="bg-bir-red h-1/2 w-1/2 rounded-tl-[100%]"></div>
      <div className="bg-bir-blue h-1/2 w-1/2 rounded-tr-[100%]"></div>
      <div className="bg-bir-green h-1/2 w-1/2 rounded-bl-[100%]"></div>
      <div className="bg-bir-yellow h-1/2 w-1/2 rounded-br-[100%]"></div>
    </div>
  </>
);

export function BirCardDisplay(
  card: Omit<BirCard, "id"> & { colorOverride?: BirCardColor },
) {
  const color = card.colorOverride || card.color;

  return (
    <div className="bg-bir-white relative flex h-44 w-28 select-none items-center justify-center rounded-lg font-cabin">
      {card.color === "BLACK"
        ? colorGridElement
        : middleTextElement(numbers.get(card.cardType))}
      <div
        className={`${colors.get(color)} flex h-40 w-24 items-center justify-center rounded-lg`}
      >
        <div className="border-1 drop-shadow-bir-small-text absolute bottom-2 right-3 rotate-180 border-solid border-black text-xl font-bold">
          {numbers.get(card.cardType)}
        </div>
        <div className="border-1 drop-shadow-bir-small-text absolute left-3 top-2 border-solid border-black text-xl font-bold">
          {numbers.get(card.cardType)}
        </div>
      </div>
    </div>
  );
}

export function BirCardTopViewDisplay() {
  return (
    <div className="bg-bir-white relative flex h-44 w-28 select-none items-center justify-center rounded-lg font-cabin">
      <div className="border-bir-white bg-bir-red absolute flex h-40 w-20 rotate-[30deg] items-center justify-center rounded-[100%] border-4 border-solid">
        <div className="border-1 text-bir-yellow drop-shadow-bir-large-text rotate-[-50deg] pl-1 text-[2rem] font-bold">
          BİR
        </div>
      </div>
      <div
        className={`${colors.get("BLACK")} flex h-40 w-24 items-center justify-center rounded-lg`}
      ></div>
    </div>
  );
}
