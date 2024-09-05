import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { api } from "../../../convex/_generated/api";
import { Doc } from "../../../convex/_generated/dataModel";
import { useMutation } from "convex/react";

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
        gameState.winningPlayerId === playerId
          ? "You won the contract!"
          : "You lost the contract.";
      setResultMsg(msg);
    } else {
      const msg =
        gameState.winningPlayerId === playerId
          ? "Congratulations! You won the game."
          : "Sorry, better luck next time. You lost the game.";
      setResultMsg(msg);
    }
    setAcknowledged(false);
  }, [gameState?.winningPlayerId, gameState?.endTime, playerId]);

  if (!user || !gameState) {
    return <></>;
  }

  let playerMonsters: "playerOneMonsters" | "playerTwoMonsters";
  let chosenMonster, score, opponentScore;

  if (user.id === gameState.playerOneId) {
    playerMonsters = "playerOneMonsters";
    chosenMonster = gameState.currentPlayerOneMonster;
    score = gameState.playerOnePoints;
    opponentScore = gameState.playerTwoPoints;
  } else if (user.id === gameState.playerTwoId) {
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
    event
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
        <button
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            if (onExit) {
              onExit(event);
            }
          }}
        >
          Back To Game List
        </button>
        <hr />
        <h1>{resultMsg}</h1>
      </div>
    );
  }

  return (
    <div className="game-board">
      <button
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          if (onExit) {
            onExit(event);
          }
        }}
      >
        Back To Game List
      </button>

      <article className="game_board__contract">
        <h1>{gameState.currentContract.title}</h1>
        <h2>{gameState.currentContract.type}</h2>
        <p>{gameState.currentContract.description}</p>
        <div
          className="game_board__contract__monster-selections"
          style={{ display: "flex", gap: "1rem", justifyContent: "center" }}
        >
          <div
            style={{
              maxHeight: "150px",
              minHeight: "150px",
              maxWidth: "150px",
              minWidth: "150px",
              border: "1px dashed white",
            }}
          >
            {gameState.currentPlayerOneMonster ? (
              <div
                className="game_board__player-cards__card"
                style={{
                  maxHeight: "150px",
                  minHeight: "150px",
                  maxWidth: "150px",
                  minWidth: "150px",
                  border: "1px solid white",
                }}
              >
                {gameState.currentPlayerOneMonster.monsterType}
              </div>
            ) : (
              `Choose Your Monster`
            )}
          </div>
          <div
            style={{
              maxHeight: "150px",
              minHeight: "150px",
              maxWidth: "150px",
              minWidth: "150px",
              border: "1px dashed white",
            }}
          >
            {gameState.currentPlayerTwoMonster ? (
              <div
                className="game_board__player-cards__card"
                style={{
                  maxHeight: "150px",
                  minHeight: "150px",
                  maxWidth: "150px",
                  minWidth: "150px",
                  border: "1px solid white",
                }}
              >
                {gameState.currentPlayerTwoMonster.monsterType}
              </div>
            ) : (
              `Waiting For Competitor`
            )}
          </div>
        </div>

        {resultMsg && (
          <>
            <h3>{resultMsg}</h3>
            <button
              onClick={async () => {
                setAcknowledged(true);
                await acknowledgeRound({
                  gameStateId: gameState._id,
                  playerId,
                });
              }}
            >
              {acknowledged ? `Waiting For Competitor` : `Next Round`}
            </button>
          </>
        )}
      </article>
      <div className="game_board__player-hand">
        <h1>Your Monsters</h1>

        <div
          className="game_board__player-cards"
          style={{ display: "flex", gap: "1rem", justifyContent: "center" }}
        >
          {playerCards &&
            playerCards.map((card) => (
              <div
                key={card.id}
                onClick={cardChosenHandler}
                className="game_board__player-cards__card"
                style={{
                  maxHeight: "150px",
                  minHeight: "150px",
                  maxWidth: "150px",
                  minWidth: "150px",
                  border: "1px solid white",
                }}
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
