import { useContext } from "react";
import { UnoUser } from "../../models/unoGameState";
import { UserContext } from "../context/UserContext";

type UnoPlayersInfoProps = {
  users: UnoUser[];
  currentUser: string;
};

function UnoPlayersInfo({ users, currentUser }: UnoPlayersInfoProps) {
  const { userNickName } = useContext(UserContext);
  const applicationUserIndex = users.findIndex(
    (user) => user.name === userNickName,
  );

  let usersToDisplay: UnoUser[] = users
    .slice(0, applicationUserIndex)
    .reverse();

  usersToDisplay = [
    ...usersToDisplay,
    ...users.slice(applicationUserIndex + 1).reverse(),
  ];

  console.log(usersToDisplay);

  return (
    <div className="flex gap-x-4">
      {usersToDisplay.map((user) =>
        currentUser === user.name ? (
          <div className="flex animate-bounce flex-col items-center rounded bg-game-accent-light p-2 text-game-main-dark">
            <p>{user.name}</p>
            <p>{user.cardCount}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center rounded bg-game-accent-light p-2 text-game-main-dark">
            <p>{user.name}</p>
            <p>{user.cardCount}</p>
          </div>
        ),
      )}
    </div>
  );
}

export default UnoPlayersInfo;
