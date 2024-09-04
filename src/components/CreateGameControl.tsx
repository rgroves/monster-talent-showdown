import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

interface ICreateGameControlProps {
  joinCode: string | null;
  onCreate: (gameId: Id<"games">, joinCode: string) => void;
}

export default function CreateGameControl({
  joinCode,
  onCreate,
}: ICreateGameControlProps) {
  const createGame = useMutation(api.games.create);

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
  } else {
    return <p>Give this join code to your competitor: {joinCode}</p>;
  }
}
