import { useMemo } from "react";
import { Doc } from "../../convex/_generated/dataModel";
import GameCard from "./GameCard";

interface IGameListProps {
  games: Doc<"games">[] | undefined;
  onActivateGame: (game: Doc<"games">) => void;
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
      <h1 className="m-2 my-8 text-balance text-base font-black sm:text-xl lg:text-3xl">
        Your Game List
      </h1>

      <hr className="my-8" />
      <h2 className="m-2 my-8 text-balance text-sm font-extrabold sm:text-lg lg:text-2xl">
        Games In Progress
      </h2>
      {inProgressGames.length > 0 ?
        inProgressGames.map((game) => (
          <GameCard
            key={game._id}
            game={game}
            onActivateGame={onActivateGame}
          />
        ))
      : <p>
          You have no games in progress. You can start or join a game using the
          buttons above.
        </p>
      }

      <hr className="my-8" />
      <h2 className="m-2 my-8 text-balance text-sm font-extrabold sm:text-lg lg:text-2xl">
        Games Waiting For A Competitor
      </h2>
      {joiningGames.length > 0 ?
        joiningGames.map((game) => <GameCard key={game._id} game={game} />)
      : <p>You have no games waiting for a competitor to join.</p>}

      <hr className="my-8" />
      <h2 className="m-2 my-8 text-balance text-sm font-extrabold sm:text-lg lg:text-2xl">
        Completed Games
      </h2>
      {completedGames.length > 0 ?
        completedGames.map((game) => <GameCard key={game._id} game={game} />)
      : <p>You have no completed games.</p>}
    </>
  );
}
