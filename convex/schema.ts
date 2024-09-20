import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const contractCardValidator = v.object({
  id: v.string(),
  title: v.string(),
  type: v.string(),
  description: v.string(),
});

const monsterCardValidator = v.object({
  id: v.string(),
  monsterType: v.string(),
  primaryAbility: v.string(),
  secondaryAbility: v.string(),
  timeAdvantage: v.string(),
});

export default defineSchema({
  games: defineTable({
    ownerUserId: v.string(),
    opponentUserId: v.optional(v.string()),
    joinCode: v.string(),
    status: v.string(),
  })
    .index("byJoinCode", ["joinCode"])
    .index("byOwner", ["ownerUserId"])
    .index("byOpponent", ["opponentUserId"]),

  gameState: defineTable({
    gameId: v.id("games"),
    playerOneId: v.string(),
    playerTwoId: v.string(),
    startTime: v.string(),
    endTime: v.optional(v.string()),
    contractDeck: v.array(contractCardValidator),
    nextContractCardIdx: v.number(),
    monsterDeck: v.array(monsterCardValidator),
    nextMonsterCardIdx: v.number(),
    playerOneMonsters: v.array(monsterCardValidator),
    playerTwoMonsters: v.array(monsterCardValidator),
    currentContract: contractCardValidator,
    currentPlayerOneMonster: v.optional(monsterCardValidator),
    currentPlayerTwoMonster: v.optional(monsterCardValidator),
    winningPlayerId: v.optional(v.string()),
    playerOnePoints: v.number(),
    playerTwoPoints: v.number(),
    playerOneRoundAck: v.boolean(),
    playerTwoRoundAck: v.boolean(),
  }).index("byGameId", ["gameId"]),
});
