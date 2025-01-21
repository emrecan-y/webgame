import { useEffect, useRef } from "react";
import { UnoCardColor } from "../../models/unoCard";

type UnoColorPickerProps = {
  mouseEvent: React.MouseEvent<HTMLDivElement, MouseEvent>;
  setMouseEvent: React.Dispatch<
    React.SetStateAction<
      React.MouseEvent<HTMLDivElement, MouseEvent> | undefined
    >
  >;
  pickColor: (color: UnoCardColor) => void;
};

function UnoColorPicker({
  mouseEvent,
  setMouseEvent,
  pickColor,
}: UnoColorPickerProps) {
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
        <p className="animate-bounce text-xl drop-shadow-uno-small-text">
          Select a color!
        </p>
        <div className="mt-4 flex h-40 w-40 flex-wrap rounded-full border-4 border-uno-black bg-uno-white outline outline-8 outline-uno-white">
          <div
            onClick={() => pickColor("RED")}
            className="h-1/2 w-1/2 rounded-tl-[100%] bg-uno-red transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:scale-105 hover:cursor-pointer"
          ></div>
          <div
            onClick={() => pickColor("BLUE")}
            className="h-1/2 w-1/2 rounded-tr-[100%] bg-uno-blue transition-transform hover:-translate-y-0.5 hover:translate-x-0.5 hover:scale-105 hover:cursor-pointer"
          ></div>
          <div
            onClick={() => pickColor("GREEN")}
            className="h-1/2 w-1/2 rounded-bl-[100%] bg-uno-green transition-transform hover:-translate-x-0.5 hover:translate-y-0.5 hover:scale-105 hover:cursor-pointer"
          ></div>
          <div
            onClick={() => pickColor("YELLOW")}
            className="h-1/2 w-1/2 rounded-br-[100%] bg-uno-yellow transition-transform hover:translate-x-0.5 hover:translate-y-0.5 hover:scale-105 hover:cursor-pointer"
          ></div>
        </div>
      </div>
    </>
  );
}

export default UnoColorPicker;
