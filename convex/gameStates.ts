import { v } from "convex/values";
import { query } from "./_generated/server";

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
