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
              className="my-2 flex min-h-[150px] min-w-[150px] max-w-[150px] flex-col items-center justify-center text-balance border border-solid border-black bg-gradient-to-b from-purple-50 to-purple-300 p-2 text-center"
            >
              <img
                src={`./cards/${card.monsterType.toLowerCase()}-${card.primaryAbility?.toLowerCase()}.webp`}
                className="h-auto max-w-full"
                height={300}
                width={300}
              />

              <p>{card.monsterType}</p>
              <p>{card.primaryAbility}</p>
              <p>{card.secondaryAbility}</p>
              <p>{card.timeAdvantage}</p>

              <Button
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
