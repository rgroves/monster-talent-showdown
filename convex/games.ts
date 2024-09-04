import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { createShuffledContractDeck } from "./game_logic/contract";
import { createShuffledMonsterDeck } from "./game_logic/monster";

enum GameState {
  JOINING = "JOINING",
  INPROGRESS = "INPROGRESS",
  COMPLETED = "COMPLETED",
  ABANDONED = "ABANDONED",
}

export const create = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      console.error("Failed to create game: Unauthenticated");
      return null;
    }

    const joinCode = crypto.randomUUID();

    const game = {
      ownerUserId: identity.subject,
      joinCode,
      status: GameState.JOINING,
    };

    const gameId = await ctx.db.insert("games", game);

    return { ...game, _id: gameId };
  },
});

export const get = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (identity === null) {
      console.warn("No games were retrieved: Unauthenticated");
      return [];
    }

    const ownedGames = await ctx.db
      .query("games")
      .withIndex("byOwner", (q) => q.eq("ownerUserId", identity.subject))
      .collect();

    const opponentGames = await ctx.db
      .query("games")
      .withIndex("byOpponent", (q) => q.eq("opponentUserId", identity.subject))
      .collect();

    return [...ownedGames, ...opponentGames];
  },
});

export const join = mutation({
  args: { joinCode: v.string() },
  handler: async (ctx, { joinCode }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      console.log("Failed to create game: Unauthenticated");
      return;
    }

    const game = await ctx.db
      .query("games")
      .withIndex("byJoinCode", (q) => q.eq("joinCode", joinCode))
      .filter((q) => q.eq(q.field("opponentUserId"), undefined))
      .unique();

    if (!game) {
      console.error("Invalid join code");
      return null;
    }

    const contractDeck = createShuffledContractDeck();
    let nextContractCardIdx = 0;
    const currentContract = contractDeck[nextContractCardIdx++];
    const monsterDeck = createShuffledMonsterDeck();
    let nextMonsterCardIdx = 0;
    const playerOneMonsters = [
      ...monsterDeck.slice(nextMonsterCardIdx, nextMonsterCardIdx + 5),
    ];
    nextMonsterCardIdx += 5;
    const playerTwoMonsters = [
      ...monsterDeck.slice(nextMonsterCardIdx, nextMonsterCardIdx + 5),
    ];
    nextMonsterCardIdx += 5;
    const state = {
      startTime: new Date().toISOString(),
      gameId: game._id,
      playerOneId: game.ownerUserId,
      playerTwoId: identity.subject,
      contractDeck: contractDeck,
      nextContractCardIdx,
      monsterDeck: monsterDeck,
      nextMonsterCardIdx,
      playerOneMonsters,
      playerTwoMonsters,
      currentContract,
    };

    const gameStateId = await ctx.db.insert("gameState", state);

    await ctx.db.patch(game._id, {
      opponentUserId: identity.subject,
      status: GameState.INPROGRESS,
    });

    return game._id;
  },
});
