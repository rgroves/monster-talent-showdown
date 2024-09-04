import { Doc, Id } from "../../convex/_generated/dataModel";

interface IGameListProps {
  games: Doc<"games">[] | undefined;
  newJoinCode: Doc<"games">["joinCode"] | null;
  shouldRender: boolean;
  onActivateGame: (gameId: Id<"games">) => void;
}

export default function GameList({
  games,
  newJoinCode,
  shouldRender,
  onActivateGame,
}: IGameListProps) {
  if (!shouldRender) {
    return <></>;
  }

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
