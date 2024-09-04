import { Doc } from "../_generated/dataModel";
import { shuffle } from "./utility";

enum TimeAdvantage {
  Day = "DAY",
  Night = "NIGHT",
  Any = "ANY",
}

export type MonsterDeck = Doc<"gameState">["monsterDeck"];

const baseMonsterDeck: MonsterDeck = [
  { id: "", monsterType: "Golem", timeAdvantage: TimeAdvantage.Any },
  { id: "", monsterType: "Banshee", timeAdvantage: TimeAdvantage.Night },
  { id: "", monsterType: "Mummy", timeAdvantage: TimeAdvantage.Any },
  { id: "", monsterType: "Ghost", timeAdvantage: TimeAdvantage.Any },
  { id: "", monsterType: "Sasquatch", timeAdvantage: TimeAdvantage.Day },
  { id: "", monsterType: "Kitsune", timeAdvantage: TimeAdvantage.Night },
  { id: "", monsterType: "Leprechaun", timeAdvantage: TimeAdvantage.Day },
  { id: "", monsterType: "Zombie", timeAdvantage: TimeAdvantage.Any },
  { id: "", monsterType: "Imp", timeAdvantage: TimeAdvantage.Day },
  { id: "", monsterType: "Vampire", timeAdvantage: TimeAdvantage.Night },
  { id: "", monsterType: "Fairy", timeAdvantage: TimeAdvantage.Day },
  { id: "", monsterType: "Werewolf", timeAdvantage: TimeAdvantage.Night },
];

const monsterDeck = [
  ...baseMonsterDeck,
  ...baseMonsterDeck,
  ...baseMonsterDeck,
  ...baseMonsterDeck,
];

function shuffleMonsterDeck(deck: MonsterDeck): MonsterDeck {
  return (shuffle(deck) as MonsterDeck).map((card) => ({
    ...card,
    id: crypto.randomUUID(),
  }));
}

export function createShuffledMonsterDeck(): MonsterDeck {
  return shuffleMonsterDeck(Array.from(monsterDeck));
}
