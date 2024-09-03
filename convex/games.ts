import { mutation, query } from "./_generated/server";

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
      throw new Error("Failed to create game: Unauthenticated");
    }

    const joinCode = crypto.randomUUID();

    await ctx.db.insert("games", {
      ownerUserId: identity.subject,
      joinCode,
      status: GameState.JOINING,
    });

    return joinCode;
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
