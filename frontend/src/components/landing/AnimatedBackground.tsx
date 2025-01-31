import { useEffect, useRef } from "react";
import { UnoCardTopViewDisplay } from "../game/UnoCardDisplay";
import { createRoot } from "react-dom/client";

export function AnimatedBackground() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  function getRandomNumber(min: number, max: number) {
    return Math.round(Math.random() * (max - min) + min);
  }

  function injectKeyframe(angle: number, directionX: number) {
    const keyframeName = `fall-${angle}-${directionX}`;
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes ${keyframeName} {
        0% {
          top: -250px;
          transform: rotate(0deg) ;
        }
        100% {
          top: calc(100% + 250px);
          transform: rotate(${angle}deg) translateX(${directionX}vw);
        }
      }
    `;
    document.head.appendChild(style);
    return { style, keyframeName };
  }

  useEffect(() => {
    const interval = setInterval(
      () => {
        if (containerRef.current) {
          const cardElement = document.createElement("div");

          const angle = getRandomNumber(-180, 180);
          const directionX = getRandomNumber(-20, 20);
          const { style, keyframeName } = injectKeyframe(angle, directionX);

          cardElement.style.position = "absolute";
          cardElement.style.top = "0vh";
          cardElement.style.left = `${getRandomNumber(0, 100)}vw`;
          cardElement.style.scale = `0.${getRandomNumber(40, 99)}`;
          cardElement.style.animation = `${keyframeName} ${getRandomNumber(8, 12)}s linear `;
          cardElement.style.filter = "drop-shadow(0px 0px 25px #000000)";

          const cardContent = document.createElement("div");
          createRoot(cardContent).render(<UnoCardTopViewDisplay />);
          cardElement.appendChild(cardContent);

          containerRef.current.appendChild(cardElement);

          cardElement.addEventListener("animationend", () => {
            if (containerRef.current) {
              containerRef.current.removeChild(cardElement);
            }
            document.head.removeChild(style);
          });
        }
      },
      getRandomNumber(400, 700),
    );

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="absolute left-0 top-0 -z-10 h-screen w-full overflow-hidden bg-transparent"
      ref={containerRef}
    ></div>
  );
}
