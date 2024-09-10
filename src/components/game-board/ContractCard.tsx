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
  const player1ChooseMsg =
    playerNbr === 1 ? "Choose Your Monster" : "Waiting for Player 1";
  const player2ChooseMsg =
    playerNbr === 2 ? "Choose Your Monster" : "Waiting for Player 2";

  return (
    <Card className="mx-auto bg-gradient-to-b from-indigo-50 to-indigo-200 md:max-w-prose">
      <CardHeader>
        <h1>Contract</h1>
        <CardTitle>{contract.title}</CardTitle>
        <CardDescription>{contract.type}</CardDescription>
      </CardHeader>
      <CardContent className="text-balanced text-left">
        <div>{contract.description}</div>
        <div className="my-4 grid grid-cols-1 justify-items-center md:grid-cols-2">
          <div className="my-2 flex max-h-[150px] min-h-[150px] min-w-[150px] max-w-[150px] items-center justify-center text-balance border border-dashed border-black bg-white p-2 text-center">
            {playerOneMonster ? playerOneMonster.monsterType : player1ChooseMsg}
          </div>
          <div className="my-2 flex max-h-[150px] min-h-[150px] min-w-[150px] max-w-[150px] items-center justify-center text-balance border border-dashed border-black bg-white p-2 text-center">
            {playerTwoMonster ? playerTwoMonster.monsterType : player2ChooseMsg}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
