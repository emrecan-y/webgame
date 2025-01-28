import { useContext } from "react";
import { Direction, UnoUser } from "../../models/unoGameState";
import { UserContext } from "../context/UserContext";

type UnoPlayersInfoProps = {
  users: UnoUser[];
  currentUser: string;
  direction: Direction;
};

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
    <div className="flex gap-x-4">
      {direction === "ANTI_CLOCKWISE" ? (
        <p className="text-8xl text-game-accent-light">⤹</p>
      ) : (
        <p className="scale-y-[-1] text-8xl text-game-accent-light">⤹</p>
      )}
      {usersToDisplay.map((user) => (
        <div
          key={`player-info-${user.name}`}
          className={`flex flex-col items-center rounded bg-game-accent-light p-2 text-game-main-dark ${currentUser === user.name && "animate-bounce"}`}
        >
          <p>{user.name}</p>
          <p>Cardcount: {user.cardCount}</p>
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
