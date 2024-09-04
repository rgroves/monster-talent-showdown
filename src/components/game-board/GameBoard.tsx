import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

interface IGameBoardProps {
  gameId: Id<"games"> | null;
  onExit: React.MouseEventHandler<HTMLButtonElement> | undefined;
}

export default function GameBoard({ gameId, onExit }: IGameBoardProps) {
  const gameState = useQuery(
    api.gameStates.getByGameId,
    gameId ? { gameId } : "skip"
  );

  if (!gameState) {
    return <></>;
  }

  return (
    <>
      <div>Game State for {gameId}</div>
      <div>{JSON.stringify(gameState)}</div>
      <button
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          if (onExit) {
            onExit(event);
          }
        }}
      >
        Exit Game
      </button>
    </>
  );
}
