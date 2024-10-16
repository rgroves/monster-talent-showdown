import { Doc } from "convex/_generated/dataModel";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface IContractCardProps {
  contract: Doc<"gameState">["currentContract"];
  playerNbr: 1 | 2;
  playerOneMonster?: Doc<"gameState">["currentPlayerOneMonster"];
  playerTwoMonster?: Doc<"gameState">["currentPlayerOneMonster"];
}
export default function ContractCard({
  contract,
  playerNbr,
  playerOneMonster,
  playerTwoMonster,
}: IContractCardProps) {
  const playerOneChooseMsg =
    playerNbr === 1 ? "Choose Your Monster" : "Waiting for Player 1";
  const playerTwoChooseMsg =
    playerNbr === 2 ? "Choose Your Monster" : "Waiting for Player 2";

  const playerOneCardBackground =
    playerOneMonster ?
      "bg-gradient-to-b from-purple-50 to-purple-300"
    : "bg-white";
  const playerTwoCardBackground =
    playerTwoMonster ?
      "bg-gradient-to-b from-purple-50 to-purple-300"
    : "bg-white";

  return (
    <Card className="mx-auto bg-gradient-to-b from-indigo-50 to-indigo-200 md:max-w-prose">
      <CardHeader>
        <h1>Contract</h1>
        <CardTitle>{contract.title}</CardTitle>
        <CardDescription>{contract.type}</CardDescription>
      </CardHeader>
      <CardContent className="text-balanced text-left">
        <div>{contract.description}</div>
        <div className="my-4 grid grid-cols-1 justify-items-center sm:grid-cols-2">
          <div
            className={`${playerOneCardBackground} my-1 flex max-h-[150px] min-h-[150px] min-w-[150px] max-w-[150px] items-center justify-center text-balance border border-dashed border-black p-2 text-center`}
          >
            {playerOneMonster ?
              playerOneMonster.monsterType
            : playerOneChooseMsg}
          </div>
          <div
            className={`${playerTwoCardBackground} my-1 flex max-h-[150px] min-h-[150px] min-w-[150px] max-w-[150px] items-center justify-center text-balance border border-dashed border-black p-2 text-center`}
          >
            {playerTwoMonster ?
              playerTwoMonster.monsterType
            : playerTwoChooseMsg}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
