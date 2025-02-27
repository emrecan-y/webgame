import { useEffect, useState } from "react";

function useTitleEffect(): [
  React.Dispatch<React.SetStateAction<string>>,
  React.Dispatch<React.SetStateAction<boolean>>,
] {
  const [currentTitle, setCurrentTitle] = useState<string>("");
  const [isBlinking, setIsBlinking] = useState<boolean>(false);
  const [isTabFocused, setIsTabFocused] = useState<boolean>(false);

  const handleVisibilityChange = () => {
    if (document.visibilityState === "hidden") {
      setIsTabFocused(false);
    } else {
      setIsTabFocused(true);
    }
  };

  useEffect(() => {
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    const oldTitle = document.title;
    const extendedTitle = oldTitle + " " + currentTitle;
    let interval: number | undefined;

    if (isBlinking && !isTabFocused) {
      interval = setInterval(() => {
        document.title = document.title === oldTitle ? extendedTitle : oldTitle;
        handleVisibilityChange();
      }, 200);
    } else {
      document.title = extendedTitle;
    }

    return () => {
      document.title = oldTitle;
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [currentTitle, isBlinking, isTabFocused]);

  return [setCurrentTitle, setIsBlinking];
}

export default useTitleEffect;
