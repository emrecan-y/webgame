import { useEffect, useRef, useState } from "react";
import { UnoCardTopViewDisplay } from "../game/UnoCardDisplay";
import { createRoot } from "react-dom/client";

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
          transform: rotate(0deg);
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

export function AnimatedBackground() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isTabActive, setIsTabActive] = useState(true);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsTabActive(false);
      } else {
        setIsTabActive(true);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      Array.from(container.children).forEach((child) => {
        if (child instanceof HTMLElement) {
          child.style.animationPlayState = isTabActive ? "running" : "paused";
        }
      });
    }
  }, [isTabActive]);

  useEffect(() => {
    if (isTabActive) {
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
            cardElement.style.animation = `${keyframeName} ${getRandomNumber(8, 12)}s linear`;
            cardElement.style.filter = "drop-shadow(0px 0px 25px #000000)";

            createRoot(cardElement).render(<UnoCardTopViewDisplay />);

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
    }
  }, [isTabActive]);

  return (
    <div
      className="absolute left-0 top-0 -z-10 max-h-full min-h-screen w-full overflow-hidden overflow-y-clip bg-transparent"
      ref={containerRef}
    ></div>
  );
}
