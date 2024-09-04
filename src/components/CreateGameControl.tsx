import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

interface ICreateGameControlProps {
  joinCode: string | null;
  shouldRender: boolean;
  onCreate: (gameId: Id<"games">, joinCode: string) => void;
}

export default function CreateGameControl({
  joinCode,
  shouldRender,
  onCreate,
}: ICreateGameControlProps) {
  const createGame = useMutation(api.games.create);

  if (!shouldRender) {
    return <></>;
  }

  if (!joinCode) {
    return (
      <button
        onClick={async () => {
          const game = await createGame();
          // TODO handle game creation failure
          if (game && game._id) {
            onCreate(game?._id, game.joinCode);
          }
        }}
      >
        Start A New Game
      </button>
    );
  }
}
