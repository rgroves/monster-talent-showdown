const version = process.argv[2];

console.log({ args: process.argv, version });

const dayMonsters = ["Fairy", "Imp", "Sasquatch", "Leprechaun"];
const nightMonsters = ["Vampire", "Werewolf", "Banshee", "Kitsune"];
const anytimeMonsters = ["Mummy", "Golem", "Zombie", "Ghost"];

function createMonsterCard(monsterType, timeAdvantage) {
  return {
    monsterType,
    timeAdvantage,
  };
}

function shuffle(deck) {
  for (let i = deck.length - 1; i >= 1; i--) {
    const j = Math.floor(Math.random() * i);
    // console.log(
    //   `--> Swapping: ${i} <-> ${j} | ${JSON.stringify(deck[i])} <-> ${JSON.stringify(deck[j])}`
    // );
    const temp = deck[j];
    deck[j] = deck[i];
    deck[i] = temp;
    // console.log(
    //   `--> Swapped: ${i} *-* ${j} | ${JSON.stringify(deck[i])} *-* ${JSON.stringify(deck[j])}`
    // );
  }
}

const deck = [
  ...dayMonsters.map((monster) => createMonsterCard(monster, "DAY")),
  ...nightMonsters.map((monster) => createMonsterCard(monster, "NIGHT")),
  ...anytimeMonsters.map((monster) => createMonsterCard(monster, "ANY")),
];

// console.log(">>>");
// console.log(deck.map((card, idx) => `${idx}. ${JSON.stringify(card)}`));

console.log(JSON.stringify(deck));
shuffle(deck);
console.log(JSON.stringify(deck));

// console.log(">>>");
// console.log(deck.map((card, idx) => `${idx}. ${JSON.stringify(card)}`));
