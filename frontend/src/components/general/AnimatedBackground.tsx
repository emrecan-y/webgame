import { useEffect, useRef, useState } from "react";
import { BirCardBack } from "../game/BirCard";
import { createRoot } from "react-dom/client";

export function AnimatedBackground() {
  const concurrentCardCount = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isTabActive, setIsTabActive] = useState(true);

  const concurrentCardLimit = 25;

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
          if (!isTabActive) {
            clearInterval(interval);
          } else if (concurrentCardCount.current < concurrentCardLimit) {
            injectCard();
          }
        },
        getRandomNumber(400, 700),
      );

      return () => clearInterval(interval);
    }
  }, [isTabActive]);

  function injectCard() {
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

    createRoot(cardElement).render(<BirCardBack />);
    concurrentCardCount.current++;

    containerRef.current?.appendChild(cardElement);

    cardElement.addEventListener("animationend", () => {
      if (containerRef.current) {
        containerRef.current.removeChild(cardElement);
      }
      concurrentCardCount.current--;
      document.head.removeChild(style);
    });
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

  function getRandomNumber(min: number, max: number) {
    return Math.round(Math.random() * (max - min) + min);
  }

  return (
    <div
      className="absolute left-0 top-0 -z-10 max-h-full min-h-dvh w-full overflow-hidden overflow-y-clip bg-transparent"
      ref={containerRef}
    ></div>
  );
}
