import { useEffect, useRef } from "react";
import { UnoCardTopViewDisplay } from "../game/UnoCardDisplay";
import { createRoot } from "react-dom/client";

export function AnimatedBackground() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  function getRandomNumber(min: number, max: number) {
    return Math.round(Math.random() * (max - min) + min);
  }

  function injectKeyframes(angle: number, directionX: number) {
    const keyframeName = `fall-${angle}-${directionX}`;
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes ${keyframeName} {
        0% {
          top: -20vh;
          transform: rotate(0deg) ;
        }
        100% {
          top: 150vh;
          transform: rotate(${angle}deg) translateX(${directionX}vw);
        }
      }
    `;
    document.head.appendChild(style);
    return style;
  }

  useEffect(() => {
    const interval = setInterval(
      () => {
        if (containerRef.current) {
          const cardElement = document.createElement("div");
          const angle = getRandomNumber(-180, 180);
          const directionX = getRandomNumber(-20, 20);

          const keyframeName = `fall-${angle}-${directionX}`;

          cardElement.style.position = "absolute";
          cardElement.style.top = `${getRandomNumber(0, 100)}vh`;
          cardElement.style.left = `${getRandomNumber(0, 100)}vw`;
          cardElement.style.scale = `0.${getRandomNumber(40, 99)}`;
          cardElement.style.animation = `${keyframeName} 12s linear `;

          const cardContent = document.createElement("div");
          createRoot(cardContent).render(<UnoCardTopViewDisplay />);

          const injectedStyle = injectKeyframes(angle, directionX);

          cardElement.appendChild(cardContent);
          containerRef.current.appendChild(cardElement);

          cardElement.addEventListener("animationend", () => {
            if (containerRef.current) {
              containerRef.current.removeChild(cardElement);
            }
            document.head.removeChild(injectedStyle);
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
