import { type ContractDeck } from "./contract";
import { type MonsterDeck } from "./monster";

export function shuffle(deck: ContractDeck | MonsterDeck) {
  // Shuffles a deck in place.
  // Shuffle algorithm details: https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#The_modern_algorithm
  for (let i = deck.length - 1; i >= 1; i--) {
    const j = Math.floor(Math.random() * i);
    const temp = deck[j];
    deck[j] = deck[i];
    deck[i] = temp;
  }

  // Even though shuffling in place, retruning here for chaining/return passthrough.
  return deck;
}
