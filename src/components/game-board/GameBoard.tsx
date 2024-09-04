import { Doc } from "../../../convex/_generated/dataModel";

interface IGameBoardProps {
  gameState: Doc<"gameState"> | null | undefined;
  onExit: React.MouseEventHandler<HTMLButtonElement> | undefined;
}

export default function GameBoard({ gameState, onExit }: IGameBoardProps) {
  if (!gameState) {
    return <></>;
  }

  return (
    <>
      <div>Game State for {gameState.gameId}</div>
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
