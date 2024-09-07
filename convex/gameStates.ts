import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc } from "./_generated/dataModel";

const POINTS_TO_WIN_GAME = 10;

export const getByGameId = query({
  args: { gameId: v.string() },
  handler: async (ctx, { gameId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      console.error("Failed to retrieve game: Unauthenticated");
      return null;
    }

    const state = await ctx.db
      .query("gameState")
      .withIndex("byGameId")
      .filter((q) => q.eq(q.field("gameId"), gameId))
      .unique();

    return state;
  },
});

export const updateMonsterChoice = mutation({
  args: {
    gameStateId: v.id("gameState"),
    update: v.object({
      playerId: v.string(),
      cardId: v.string(),
    }),
  },

  handler: async (ctx, { gameStateId, update }) => {
    const gameState = await ctx.db.get(gameStateId);
    if (!gameState) {
      throw new Error("Invalid game state id");
    }

    let chosenCard: Doc<"gameState">["currentPlayerOneMonster"];
    let shouldDetermineWinner = false;
    let patchState: Partial<Doc<"gameState">>;

    if (update.playerId === gameState.playerOneId) {
      chosenCard = gameState.playerOneMonsters.find(
        (card) => card.id === update.cardId,
      );
      const monsters = gameState.playerOneMonsters.filter(
        (card) => card.id != update.cardId,
      );
      patchState = {
        playerOneMonsters: monsters,
        currentPlayerOneMonster: chosenCard,
      };
      shouldDetermineWinner =
        chosenCard !== undefined &&
        gameState.currentPlayerTwoMonster !== undefined;
    } else if (update.playerId === gameState.playerTwoId) {
      chosenCard = gameState.playerTwoMonsters.find(
        (card) => card.id === update.cardId,
      );
      const monsters = gameState.playerTwoMonsters.filter(
        (card) => card.id != update.cardId,
      );
      patchState = {
        playerTwoMonsters: monsters,
        currentPlayerTwoMonster: chosenCard,
      };
      shouldDetermineWinner =
        chosenCard !== undefined &&
        gameState.currentPlayerOneMonster !== undefined;
    } else {
      throw new Error("Invalid player");
    }

    if (!chosenCard) {
      throw new Error("Invalid card id");
    }

    if (shouldDetermineWinner) {
      if (Math.random() < 0.5) {
        patchState.winningPlayerId = gameState.playerOneId;
        patchState.playerOnePoints = gameState.playerOnePoints + 1;
      } else {
        patchState.winningPlayerId = gameState.playerTwoId;
        patchState.playerTwoPoints = gameState.playerTwoPoints + 1;
      }
    }

    await ctx.db.patch(gameStateId, patchState);
  },
});

export const acknowledgeRound = mutation({
  args: { gameStateId: v.id("gameState"), playerId: v.string() },
  handler: async (ctx, { gameStateId, playerId }) => {
    const gameState = await ctx.db.get(gameStateId);
    if (!gameState) {
      throw new Error("Invalid game state id");
    }

    let patchState: Partial<Doc<"gameState">>;
    let hasOpponentAcknowledged = false;

    if (playerId === gameState.playerOneId) {
      patchState = { playerOneRoundAck: true };
      hasOpponentAcknowledged = gameState.playerTwoRoundAck;
    } else if (playerId === gameState.playerTwoId) {
      patchState = { playerTwoRoundAck: true };
      hasOpponentAcknowledged = gameState.playerOneRoundAck;
    } else {
      throw new Error("Invalid player");
    }

    if (hasOpponentAcknowledged) {
      // Both players have acknowledged so check for win condition or set up the next round.
      if (
        gameState.playerOnePoints === POINTS_TO_WIN_GAME ||
        gameState.playerTwoPoints === POINTS_TO_WIN_GAME
      ) {
        // Set up Win state.
        const winningPlayerId =
          gameState.playerOnePoints === POINTS_TO_WIN_GAME ?
            gameState.playerOneId
          : gameState.playerTwoId;

        await ctx.db.patch(gameState.gameId, { status: "COMPLETED" });

        patchState = {
          endTime: new Date().toISOString(),
          // currentContract: undefined,
          currentPlayerOneMonster: undefined,
          currentPlayerTwoMonster: undefined,
          winningPlayerId,
          playerOneRoundAck: false,
          playerTwoRoundAck: false,
        };

        await ctx.db.patch(gameState._id, patchState);
      } else {
        // Set up next round

        // Pull a new contract card for the new round.
        let nextContractCardIdx = gameState.nextContractCardIdx;
        const currentContract = gameState.contractDeck[nextContractCardIdx++];

        // Give both players one more monster card.
        let nextMonsterCardIdx = gameState.nextMonsterCardIdx;
        const nextPlayerOneCard = gameState.monsterDeck[nextMonsterCardIdx++];
        const nextPlayerTwoCard = gameState.monsterDeck[nextMonsterCardIdx++];

        patchState = {
          nextContractCardIdx,
          nextMonsterCardIdx,
          playerOneMonsters: [
            ...gameState.playerOneMonsters,
            nextPlayerOneCard,
          ],
          playerTwoMonsters: [
            ...gameState.playerTwoMonsters,
            nextPlayerTwoCard,
          ],
          currentContract,
          currentPlayerOneMonster: undefined,
          currentPlayerTwoMonster: undefined,
          winningPlayerId: undefined,
          playerOneRoundAck: false,
          playerTwoRoundAck: false,
        };
      }
    }

    await ctx.db.patch(gameStateId, patchState);
  },
});
