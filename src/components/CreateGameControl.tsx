import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Doc } from "../../convex/_generated/dataModel";
import { Button } from "./ui/button";

interface ICreateGameControlProps {
  onCreate: (game: Doc<"games">) => void;
}

export default function CreateGameControl({
  onCreate,
}: ICreateGameControlProps) {
  const createGame = useMutation(api.games.create);

  return (
    <Button
      type="button"
      onClick={async () => {
        const game = await createGame();
        // TODO handle game creation failure
        if (game) {
          onCreate(game);
        }
      }}
    >
      New Game
    </Button>
  );
}
