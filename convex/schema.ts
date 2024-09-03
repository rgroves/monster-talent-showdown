import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  games: defineTable({
    ownerUserId: v.string(),
    opponentUserId: v.optional(v.string()),
    joinCode: v.string(),
    status: v.string(),
  }).index("byJoinCode", ["joinCode"]),
});
