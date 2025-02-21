import { useEffect, useRef } from "react";
import { BirCardColor } from "../../models/birCard";

type BirColorPickerProps = {
  mouseEvent: React.MouseEvent<HTMLButtonElement, MouseEvent>;
  setMouseEvent: React.Dispatch<
    React.SetStateAction<
      React.MouseEvent<HTMLButtonElement, MouseEvent> | undefined
    >
  >;
  pickColor: (color: BirCardColor) => void;
};

function BirColorPicker({
  mouseEvent,
  setMouseEvent,
  pickColor,
}: BirColorPickerProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current !== null) {
      ref.current.style.left =
        mouseEvent.clientX - ref.current.clientWidth / 2 + "px";
      ref.current.style.top =
        mouseEvent.clientY - ref.current.clientHeight + "px";
    }
  }, []);
  return (
    <>
      <div
        className="absolute z-10 h-screen w-screen hover:cursor-pointer"
        onClick={() => setMouseEvent(undefined)}
      ></div>
      <div
        className="absolute z-20 flex h-fit w-fit flex-col items-center rounded-xl"
        ref={ref}
      >
        <p className="drop-shadow-bir-small-text animate-bounce text-xl">
          Select a color!
        </p>
        <div className="border-bir-black bg-bir-white outline-bir-white mt-4 flex h-40 w-40 flex-wrap rounded-full border-4 outline outline-8">
          <div
            onClick={() => pickColor("RED")}
            className="bg-bir-red h-1/2 w-1/2 rounded-tl-[100%] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:scale-105 hover:cursor-pointer"
          ></div>
          <div
            onClick={() => pickColor("BLUE")}
            className="bg-bir-blue h-1/2 w-1/2 rounded-tr-[100%] transition-transform hover:-translate-y-0.5 hover:translate-x-0.5 hover:scale-105 hover:cursor-pointer"
          ></div>
          <div
            onClick={() => pickColor("GREEN")}
            className="bg-bir-green h-1/2 w-1/2 rounded-bl-[100%] transition-transform hover:-translate-x-0.5 hover:translate-y-0.5 hover:scale-105 hover:cursor-pointer"
          ></div>
          <div
            onClick={() => pickColor("YELLOW")}
            className="bg-bir-yellow h-1/2 w-1/2 rounded-br-[100%] transition-transform hover:translate-x-0.5 hover:translate-y-0.5 hover:scale-105 hover:cursor-pointer"
          ></div>
        </div>
      </div>
    </>
  );
}

export default BirColorPicker;
