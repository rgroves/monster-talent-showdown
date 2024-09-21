import { Doc } from "convex/_generated/dataModel";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";

interface IGameCardProps {
  game: Doc<"games">;
  onActivateGame?: (game: Doc<"games">) => void;
}

export default function GameCard({ game, onActivateGame }: IGameCardProps) {
  return (
    <Card className="my-4 bg-gradient-to-b from-indigo-50 to-indigo-200">
      <CardHeader>
        <CardTitle className="text-sm">
          Join Code:
          <br />
          {game.joinCode}
        </CardTitle>
        <CardDescription className="text-xs">
          Created at {new Date(game._creationTime).toLocaleString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-balance">
        {game.status === "INPROGRESS" ?
          <Button
            type="button"
            className="p-6"
            onClick={() => {
              if (onActivateGame) {
                onActivateGame(game);
              }
            }}
          >
            Play
          </Button>
        : game.status === "JOINING" ?
          `Competitor has not yet joined.`
        : "Game Over"}
      </CardContent>
    </Card>
  );
}
