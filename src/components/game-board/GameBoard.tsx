import { Id } from "../../../convex/_generated/dataModel";

interface IGameBoardProps {
  gameId: Id<"games"> | null;
  onExit: React.MouseEventHandler<HTMLButtonElement> | undefined;
}
export default function GameBoard({ gameId, onExit }: IGameBoardProps) {
  if (!gameId) {
    return <></>;
  }

  return (
    <>
      <div>Game State for {gameId}</div>
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
