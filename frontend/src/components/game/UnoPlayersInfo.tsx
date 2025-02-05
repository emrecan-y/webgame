import { useContext } from "react";
import { Direction, UnoUser } from "../../models/unoGameState";
import { UserContext } from "../context/UserContext";
import shadow from "../../assets/avatar-shadow.svg";
import { UnoCardTopViewDisplay } from "./UnoCardDisplay";

type UnoPlayersInfoProps = {
  users: UnoUser[];
  currentUser: string;
  direction: Direction;
};

function UnoPlayersInfoCards(cardCount: number) {
  if (cardCount == 1) {
    return (
      <div className="relative flex h-24 w-32 flex-col items-center justify-center">
        <div className="flex h-0 w-0 scale-[0.24] items-center justify-center">
          <div>
            <UnoCardTopViewDisplay />
          </div>
        </div>

        <p className="absolute bottom-0 h-7 w-7 rounded-full bg-uno-red text-center align-middle font-bold text-uno-white outline">
          <span className="text-center align-middle drop-shadow-uno-small-text">
            {cardCount}
          </span>
        </p>
      </div>
    );
  } else {
    cardCount = cardCount > 12 ? 12 : cardCount;
    const arcAngle = 50;
    const anglePerCard = (arcAngle / cardCount) * 2;
    return (
      <div className="relative flex h-24 w-32 flex-col items-center justify-center">
        <div className="flex h-0 w-0 scale-[0.24] items-center justify-center">
          {Array.from(Array(cardCount)).map((_, index) => (
            <div
              key={index}
              className="-mx-11"
              style={{
                transform: `translateY(${Math.abs(Math.floor(cardCount / 2) - index) * 10}px) rotate(${index * anglePerCard - arcAngle}deg)`,
              }}
            >
              <UnoCardTopViewDisplay />
            </div>
          ))}
        </div>
        <p className="absolute bottom-0 h-7 w-7 rounded-full bg-uno-red text-center align-middle font-bold text-uno-white outline">
          <span className="text-center align-middle drop-shadow-uno-small-text">
            {cardCount}
          </span>
        </p>
      </div>
    );
  }
}

function UnoPlayersInfo({
  users,
  currentUser,
  direction,
}: UnoPlayersInfoProps) {
  const { userNickName } = useContext(UserContext);
  const applicationUserIndex = users.findIndex(
    (user) => user.name === userNickName,
  );

  let usersToDisplay: UnoUser[] = [];
  if (applicationUserIndex === 0) {
    usersToDisplay = users.slice(1);
  } else if (applicationUserIndex === users.length - 1) {
    usersToDisplay = users.slice(0, applicationUserIndex);
  } else {
    usersToDisplay = users.slice(applicationUserIndex + 1).reverse();
    usersToDisplay = [
      ...usersToDisplay,
      ...users.slice(0, applicationUserIndex).reverse(),
    ];
  }

  return (
    <div className="flex items-center">
      {direction === "ANTI_CLOCKWISE" ? (
        <p className="text-8xl text-game-accent-light">⤹</p>
      ) : (
        <p className="scale-y-[-1] text-8xl text-game-accent-light">⤹</p>
      )}
      {usersToDisplay.map((user) => (
        <div
          key={`player-info-${user.name}`}
          className={`rounded p-2 text-game-main-dark transition-transform ${currentUser === user.name && "animate-bounce-subtle"}`}
        >
          <div className="relative flex h-40 w-max flex-col items-center justify-between">
            <img className="w-20" src={shadow} alt="no" />
            <div className="absolute top-7">
              {UnoPlayersInfoCards(user.cardCount)}
            </div>
            <p className="my-1.5 rounded-md bg-white p-1">{user.name}</p>
          </div>
        </div>
      ))}
      {direction === "CLOCKWISE" ? (
        <p className="text-8xl text-game-accent-light">⤸</p>
      ) : (
        <p className="scale-y-[-1] text-8xl text-game-accent-light">⤸</p>
      )}
    </div>
  );
}

export default UnoPlayersInfo;
