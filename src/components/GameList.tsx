import { Doc, Id } from "../../convex/_generated/dataModel";

interface IGameListProps {
  games: Doc<"games">[];
  newJoinCode: Doc<"games">["joinCode"] | null;
  onActivateGame: (gameId: Id<"games">) => void;
}

export default function GameList({
  games,
  newJoinCode,
  onActivateGame,
}: IGameListProps) {
  return (
    <>
      {games?.map(({ _id, joinCode, status }) => (
        <div key={_id}>
          {status === "INPROGRESS" ? (
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onActivateGame(_id);
              }}
            >
              {joinCode} - [{status}]
            </a>
          ) : (
            `${joinCode} - [${status}]`
          )}
          {joinCode === newJoinCode ? (
            <span>
              {" "}
              <sup>(New!)</sup>
            </span>
          ) : (
            <></>
          )}
        </div>
      ))}
    </>
  );
}
