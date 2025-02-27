import { useContext } from "react";
import { Direction, BirUser } from "../../models/birGameState";
import { UserContext } from "../context/UserContext";
import shadow from "../../assets/avatar-shadow.svg";
import { BirCardTopViewDisplay } from "./BirCardDisplay";
import rotationArrow from "../../assets/rotation_arrow.png";

type BirPlayersInfoProps = {
  users: BirUser[];
  currentUser: string;
  direction: Direction;
};

function BirPlayerSingleInfoCard(cardCount: number) {
  if (cardCount == 1) {
    return (
      <div className="relative flex h-16 w-32 flex-col items-center justify-center sm:h-24">
        <div className="flex h-0 w-0 scale-[0.2] items-center justify-center sm:scale-[0.24]">
          <div>
            <BirCardTopViewDisplay />
          </div>
        </div>

        <p className="absolute bottom-0 h-7 w-7 rounded-full bg-bir-red text-center align-middle font-bold text-bir-white outline">
          <span className="text-center align-middle drop-shadow-bir-small-text">
            {cardCount}
          </span>
        </p>
      </div>
    );
  } else {
    const cardCountToShow = cardCount > 13 ? 13 : cardCount;
    const arcAngle = 50;
    const anglePerCard = (arcAngle / cardCountToShow) * 2;
    return (
      <div className="relative flex h-16 w-32 flex-col items-center justify-center sm:h-24">
        <div className="flex h-0 w-0 scale-[0.2] items-center justify-center sm:scale-[0.24]">
          {Array.from(Array(cardCountToShow)).map((_, index) => (
            <div
              key={index}
              className="-mx-11"
              style={{
                transform: `translateY(${Math.abs(Math.floor(cardCountToShow / 2) - index) * 10}px) rotate(${index * anglePerCard - arcAngle}deg)`,
              }}
            >
              <BirCardTopViewDisplay />
            </div>
          ))}
        </div>
        <p className="absolute bottom-0 h-7 w-7 rounded-full bg-bir-red text-center align-middle font-bold text-bir-white outline">
          <span className="text-center align-middle drop-shadow-bir-small-text">
            {cardCount}
          </span>
        </p>
      </div>
    );
  }
}

function BirPlayersInfo({
  users,
  currentUser,
  direction,
}: BirPlayersInfoProps) {
  const { userNickName } = useContext(UserContext);

  let usersToDisplay: BirUser[] = [...users];
  const applicationUserIndex = users.findIndex(
    (user) => user.name === userNickName,
  );
  if (applicationUserIndex !== -1) {
    const usersBeforeApplicationUser = usersToDisplay.slice(
      0,
      applicationUserIndex,
    );
    const usersAfterApplicationUser = usersToDisplay.slice(
      applicationUserIndex + 1,
    );
    usersToDisplay = [
      ...usersAfterApplicationUser,
      ...usersBeforeApplicationUser,
    ];
  }

  return (
    <div className="flex items-center">
      <img
        src={rotationArrow}
        className={`h-16 ${direction === "CLOCKWISE" && "scale-y-[-1]"} transition-all`}
        alt=""
      />

      {usersToDisplay.map((user) => (
        <div
          key={`player-info-${user.name}`}
          className={`rounded p-2 text-game-main-dark transition-transform ${currentUser === user.name && "animate-bounce-subtle"}`}
        >
          <div className="relative flex h-28 w-max flex-col items-center justify-between sm:h-40">
            <img className="w-16 sm:w-20" src={shadow} alt="no" />
            <div className="absolute top-7 sm:top-8">
              {BirPlayerSingleInfoCard(user.cardCount)}
            </div>
            <p className="rounded-md bg-white p-1 text-xs sm:my-1.5 sm:text-sm">
              {user.name}
            </p>
          </div>
        </div>
      ))}
      <img
        src={rotationArrow}
        className={`h-16 scale-x-[-1] ${direction === "ANTI_CLOCKWISE" && "scale-y-[-1]"} transition-all`}
        alt=""
      />
    </div>
  );
}

export default BirPlayersInfo;
