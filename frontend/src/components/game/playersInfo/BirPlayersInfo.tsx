import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Direction, BirUser } from "../../../models/birGameState";
import { UserContext } from "../../context/UserContext";
import rotationArrow from "../../../assets/rotation_arrow.png";
import BirPlayersInfoElement from "./BirPlayersInfoElement";

type BirPlayersInfoProps = {
  users: BirUser[];
  currentUserName: string;
  direction: Direction;
};

function BirPlayersInfo({
  users,
  currentUserName,
  direction,
}: BirPlayersInfoProps) {
  const { userNickName } = useContext(UserContext);
  const parentRef = useRef<HTMLDivElement>(null);
  const childRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  const usersToDisplay = useMemo(() => {
    const applicationUserIndex = users.findIndex(
      (user) => user.name === userNickName,
    );

    if (applicationUserIndex !== -1) {
      const usersBeforeApplicationUser = users.slice(0, applicationUserIndex);
      const usersAfterApplicationUser = users.slice(applicationUserIndex + 1);

      return [...usersAfterApplicationUser, ...usersBeforeApplicationUser];
    }

    return users;
  }, [users, userNickName]);

  useEffect(() => {
    const checkOverflow = () => {
      if (childRef.current && parentRef.current) {
        setIsOverflowing(
          childRef.current.clientWidth > parentRef.current.clientWidth,
        );
      }
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);

    return () => {
      window.removeEventListener("resize", checkOverflow);
    };
  }, [childRef, parentRef]);

  return (
    <div ref={parentRef} className="w-full overflow-x-scroll scroll-smooth">
      <div className={`${isOverflowing && "w-max px-32"}`}>
        <div
          ref={childRef}
          className="flex w-max min-w-full items-center justify-center p-0"
        >
          <img
            src={rotationArrow}
            className={`h-16 ${direction === "CLOCKWISE" && "scale-y-[-1]"} transition-all`}
            alt=""
          />

          {usersToDisplay.map((user) => (
            <BirPlayersInfoElement
              user={user}
              currentUserName={currentUserName}
            />
          ))}
          <img
            src={rotationArrow}
            className={`h-16 scale-x-[-1] ${direction === "ANTI_CLOCKWISE" && "scale-y-[-1]"} transition-all`}
            alt=""
          />
        </div>
      </div>
    </div>
  );
}

export default BirPlayersInfo;
