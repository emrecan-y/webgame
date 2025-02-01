import { UnoCard, UnoCardColor } from "../../models/unoCard";

const colors = new Map(
  Object.entries({
    RED: "bg-uno-red",
    BLUE: "bg-uno-blue",
    GREEN: "bg-uno-green",
    YELLOW: "bg-uno-yellow",
    BLACK: "bg-uno-black",
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
      <div className="absolute flex h-40 w-20 rotate-[30deg] items-center justify-center rounded-[100%] border-4 border-solid border-uno-white">
        <div className="border-1 rotate-[-30deg] border-solid border-black pb-2 pl-1 text-[3.4rem] font-bold drop-shadow-uno-large-text">
          {value}
        </div>
      </div>
    </>
  );
};

const colorGridElement = (
  <>
    <div className="absolute flex h-40 w-20 rotate-[30deg] flex-wrap rounded-[100%] border-4 border-solid border-uno-white">
      <div className="h-1/2 w-1/2 rounded-tl-[100%] bg-uno-red"></div>
      <div className="h-1/2 w-1/2 rounded-tr-[100%] bg-uno-blue"></div>
      <div className="h-1/2 w-1/2 rounded-bl-[100%] bg-uno-green"></div>
      <div className="h-1/2 w-1/2 rounded-br-[100%] bg-uno-yellow"></div>
    </div>
  </>
);

export function UnoCardDisplay(
  card: Omit<UnoCard, "id"> & { colorOverride?: UnoCardColor },
) {
  let color: UnoCardColor = card.color;
  if (card.colorOverride != undefined) {
    color = card.colorOverride;
  }
  return (
    <div className="font-cabin relative flex h-44 w-28 select-none items-center justify-center rounded-lg bg-uno-white">
      {card.color === "BLACK"
        ? colorGridElement
        : middleTextElement(numbers.get(card.cardType))}
      <div
        className={`${colors.get(color)} flex h-40 w-24 items-center justify-center rounded-lg`}
      >
        <div className="border-1 absolute bottom-2 right-3 rotate-180 border-solid border-black text-xl font-bold drop-shadow-uno-small-text">
          {numbers.get(card.cardType)}
        </div>
        <div className="border-1 absolute left-3 top-2 border-solid border-black text-xl font-bold drop-shadow-uno-small-text">
          {numbers.get(card.cardType)}
        </div>
      </div>
    </div>
  );
}

export function UnoCardTopViewDisplay() {
  return (
    <div className="font-cabin relative flex h-44 w-28 select-none items-center justify-center rounded-lg bg-uno-white">
      <div className="absolute flex h-40 w-20 rotate-[30deg] items-center justify-center rounded-[100%] border-4 border-solid border-uno-white bg-uno-red">
        <div className="border-1 rotate-[-50deg] pl-1 text-[2rem] font-bold text-uno-yellow drop-shadow-uno-large-text">
          BİR
        </div>
      </div>
      <div
        className={`${colors.get("BLACK")} flex h-40 w-24 items-center justify-center rounded-lg`}
      ></div>
    </div>
  );
}
