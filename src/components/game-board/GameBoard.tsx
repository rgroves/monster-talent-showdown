import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { api } from "../../../convex/_generated/api";
import { Doc } from "../../../convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { Button } from "../ui/button";
import ContractCard from "./ContractCard";
import PlayerHand from "./PlayerHand";

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
      // There is a winner and this is the end of the round.
      const msg =
        gameState.winningPlayerId === playerId ?
          "You won the contract!"
        : "You lost the contract.";
      setResultMsg(msg);
    } else {
      // There is a winner and this is the end of the game.
      const msg =
        gameState.winningPlayerId === playerId ?
          "Congratulations! Your monsters have the skills that pay the bills. You win!"
        : "Your monsters' skills did not pay the bills. You lose!";
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

  console.log(gameState);

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

  const cardChosenHandler: React.MouseEventHandler<HTMLButtonElement> = async (
    event,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    if (chosenMonster) {
      return;
    }

    const cardElement = event.target as HTMLButtonElement;
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
      <PlayerHand
        allowSelection={!Boolean(chosenMonster)}
        cards={playerCards}
        onCardSelected={cardChosenHandler}
      />
      <hr />
      <div>
        <p>Your score: {score}</p>
        <p>Opponent score: {opponentScore}</p>
      </div>
    </div>
  );
}
