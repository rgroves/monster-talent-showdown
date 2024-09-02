import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  games: defineTable({
    gameId: v.string(),
    state: v.string(),
  }),
});
