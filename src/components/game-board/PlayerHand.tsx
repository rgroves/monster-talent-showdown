import { Doc } from "convex/_generated/dataModel";
import { Button } from "../ui/button";

interface IPlayerHandProps {
  allowSelection: boolean;
  cards: Doc<"gameState">["playerOneMonsters"];
  onCardSelected: React.MouseEventHandler<HTMLButtonElement>;
}

export default function PlayerHand({
  allowSelection,
  cards,
  onCardSelected,
}: IPlayerHandProps) {
  return (
    <div>
      <h1>Your Monster Talent Pool</h1>

      <div className="flex flex-wrap content-center justify-center gap-1">
        {cards &&
          cards.map((card) => (
            <div
              key={card.id}
              className="my-2 flex min-h-[150px] min-w-[150px] max-w-[150px] flex-col items-center justify-center text-balance rounded-lg border border-solid border-black bg-gradient-to-b from-purple-50 to-purple-300 p-2 text-center"
            >
              <img
                src={`./cards/${card.monsterType.toLowerCase()}-${card.primaryAbility?.toLowerCase()}.webp`}
                className="h-auto max-w-full"
                height={300}
                width={300}
              />

              <div className="my-2">
                <p className="font-bold">Monster Type:</p>
                <p>{card.monsterType}</p>
              </div>
              <div className="my-2">
                <p className="font-bold">Primary:</p>
                <p>{card.primaryAbility}</p>
              </div>
              <div className="my-2">
                <p className="font-bold">Secondary:</p>
                <p>{card.secondaryAbility}</p>
              </div>
              <div className="my-2">
                <p className="font-bold">Time Advantage:</p>
                <p>{card.timeAdvantage}</p>
              </div>

              <Button
                type="button"
                data-card-id={card.id}
                disabled={!allowSelection}
                onClick={onCardSelected}
              >
                Play Card
              </Button>
            </div>
          ))}
      </div>
    </div>
  );
}
