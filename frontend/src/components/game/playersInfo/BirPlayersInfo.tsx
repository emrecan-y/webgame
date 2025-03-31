import { useContext } from "react";
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
        <BirPlayersInfoElement user={user} currentUserName={currentUserName} />
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
