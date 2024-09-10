import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { api } from "../../../convex/_generated/api";
import { Doc } from "../../../convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { Button } from "../ui/button";
import ContractCard from "./ContractCard";

interface IGameBoardProps {
  gameState: Doc<"gameState"> | null | undefined;
  onExit: React.MouseEventHandler<HTMLButtonElement> | undefined;
}

export default function GameBoard({ gameState, onExit }: IGameBoardProps) {
  const { user } = useUser();
  const updateMonsterChoice = useMutation(api.gameStates.updateMonsterChoice);
  const acknowledgeRound = useMutation(api.gameStates.acknowledgeRound);
  const [resultMsg, setResultMsg] = useState("");
  const [acknowledged, setAcknowledged] = useState(false);

  let playerId = "";
  if (user && gameState) {
    if (user.id === gameState.playerOneId) {
      playerId = gameState.playerOneId;
    } else if (user.id === gameState.playerTwoId) {
      playerId = gameState.playerTwoId;
    }
  }

  useEffect(() => {
    if (!gameState?.winningPlayerId) {
      setResultMsg("");
      return;
    }

    if (!gameState.endTime) {
      const msg =
        gameState.winningPlayerId === playerId ?
          "You won the contract!"
        : "You lost the contract.";
      setResultMsg(msg);
    } else {
      const msg =
        gameState.winningPlayerId === playerId ?
          "Congratulations! You won the game."
        : "Sorry, better luck next time. You lost the game.";
      setResultMsg(msg);
    }
    setAcknowledged(false);
  }, [gameState?.winningPlayerId, gameState?.endTime, playerId]);

  if (!user || !gameState) {
    return <></>;
  }

  let playerNbr: 1 | 2;
  let playerMonsters: "playerOneMonsters" | "playerTwoMonsters";
  let chosenMonster, score, opponentScore;

  if (user.id === gameState.playerOneId) {
    playerNbr = 1;
    playerMonsters = "playerOneMonsters";
    chosenMonster = gameState.currentPlayerOneMonster;
    score = gameState.playerOnePoints;
    opponentScore = gameState.playerTwoPoints;
  } else if (user.id === gameState.playerTwoId) {
    playerNbr = 2;
    playerMonsters = "playerTwoMonsters";
    chosenMonster = gameState.currentPlayerTwoMonster;
    score = gameState.playerTwoPoints;
    opponentScore = gameState.playerOnePoints;
  } else {
    console.error("Player unknown");
    return <></>;
  }

  const playerCards = gameState[playerMonsters];

  const cardChosenHandler: React.MouseEventHandler<HTMLDivElement> = async (
    event,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    if (chosenMonster) {
      return;
    }

    const cardElement = event.target as HTMLDivElement;
    const cardId = cardElement.dataset["cardId"] ?? "";
    cardElement.attributeStyleMap.set("display", "none");
    await updateMonsterChoice({
      gameStateId: gameState._id,
      update: { playerId, cardId },
    });
  };

  if (gameState.endTime) {
    return (
      <div className="game-board">
        <Button
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            if (onExit) {
              onExit(event);
            }
          }}
        >
          Back To Game List
        </Button>
        <hr />
        <h1>{resultMsg}</h1>
      </div>
    );
  }

  return (
    <div className="game-board">
      <Button
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          if (onExit) {
            onExit(event);
          }
        }}
      >
        Back To Game List
      </Button>

      <hr className="m-10" />
      <ContractCard
        contract={gameState.currentContract}
        playerNbr={playerNbr}
        playerOneMonster={gameState.currentPlayerOneMonster}
        playerTwoMonster={gameState.currentPlayerTwoMonster}
      />

      <hr className="m-10" />
      <div>
        {resultMsg && (
          <>
            <h3>{resultMsg}</h3>
            <Button
              disabled={acknowledged}
              onClick={async () => {
                setAcknowledged(true);
                await acknowledgeRound({
                  gameStateId: gameState._id,
                  playerId,
                });
              }}
            >
              {acknowledged ? `Waiting For Competitor` : `Next Round`}
            </Button>
          </>
        )}
      </div>

      <hr className="m-10" />
      <div>
        <h1>Your Monster Talent Pool</h1>

        <div className="flex flex-wrap content-center justify-center gap-1">
          {playerCards &&
            playerCards.map((card) => (
              <div
                key={card.id}
                onClick={cardChosenHandler}
                className="my-2 flex max-h-[150px] min-h-[150px] min-w-[150px] max-w-[150px] items-center justify-center text-balance border border-solid border-black bg-gradient-to-b from-purple-50 to-purple-300 p-2 text-center"
                data-card-id={card.id}
              >
                {card.monsterType}
              </div>
            ))}
        </div>
      </div>
      <hr />
      <div>
        <p>Your score: {score}</p>
        <p>Opponent score: {opponentScore}</p>
      </div>
    </div>
  );
}
