import { useMemo } from "react";
import { Doc, Id } from "../../convex/_generated/dataModel";
import GameCard from "./GameCard";

interface IGameListProps {
  games: Doc<"games">[] | undefined;
  onActivateGame: (gameId: Id<"games">) => void;
}

type GameStatusMapKey = Doc<"games">["status"];
type GameStatusMapValue = Array<Doc<"games">>;

export default function GameList({ games, onActivateGame }: IGameListProps) {
  const [inProgressGames, joiningGames, completedGames] = useMemo(() => {
    const gameStatusMap = new Map<GameStatusMapKey, GameStatusMapValue>();
    games?.forEach((game) => {
      if (gameStatusMap.has(game.status)) {
        gameStatusMap.get(game.status)?.push(game);
      } else {
        gameStatusMap.set(game.status, [game]);
      }
    });
    return [
      gameStatusMap.get("INPROGRESS") ?? [],
      gameStatusMap.get("JOINING") ?? [],
      gameStatusMap.get("COMPLETED") ?? [],
    ];
  }, [games]);

  return (
    <>
      <h1 className="m-2 my-8 text-balance text-base font-black md:text-xl lg:text-3xl">
        Your Game List
      </h1>

      <hr className="my-8" />
      <h2 className="m-2 my-8 text-balance text-sm font-extrabold md:text-lg lg:text-2xl">
        Games In Progress
      </h2>
      {inProgressGames?.map((game) => (
        <GameCard key={game._id} game={game} onActivateGame={onActivateGame} />
      ))}

      <hr className="my-8" />
      <h2 className="m-2 my-8 text-balance text-sm font-extrabold md:text-lg lg:text-2xl">
        Games Waiting For A Competitor
      </h2>
      {joiningGames?.map((game) => <GameCard key={game._id} game={game} />)}

      <hr className="my-8" />
      <h2 className="m-2 my-8 text-balance text-sm font-extrabold md:text-lg lg:text-2xl">
        Completed Games
      </h2>
      {completedGames?.map((game) => <GameCard key={game._id} game={game} />)}
    </>
  );
}
