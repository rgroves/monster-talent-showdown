const version = process.argv[2];

const dayMonsters = ["Fairy", "Imp", "Sasquatch", "Leprechaun"];
const nightMonsters = ["Vampire", "Werewolf", "Banshee", "Kitsune"];
const anytimeMonsters = ["Mummy", "Golem", "Zombie", "Ghost"];

function createMonsterCard(monsterType, timeAdvantage) {
  return {
    id: "",
    monsterType,
    timeAdvantage,
    primaryAbility: undefined,
    secondaryAbility: undefined,
  };
}

function shuffle(deck) {
  for (let i = deck.length - 1; i >= 1; i--) {
    const j = Math.floor(Math.random() * i);
    const temp = deck[j];
    deck[j] = deck[i];
    deck[i] = temp;
  }
}

const allMonsters = [
  ...dayMonsters.map((monster) => createMonsterCard(monster, "DAY")),
  ...nightMonsters.map((monster) => createMonsterCard(monster, "NIGHT")),
  ...anytimeMonsters.map((monster) => createMonsterCard(monster, "ANY")),
];

const variants = ["Acting", "Comedy", "Dancing", "Singing"];

const deck = [];
let cardCount = 0;

for (let i = 0; i < allMonsters.length; i++) {
  for (let j = 0; j < variants.length; j++) {
    for (let k = 0; k < variants.length; k++) {
      if (k === j) {
        continue;
      }

      allMonsters[i].primaryAbility = variants[j];
      allMonsters[i].secondaryAbility = variants[k];
      deck.push(Object.assign({}, allMonsters[i]));
      console.log(
        `${++cardCount}. ${allMonsters[i].monsterType} - ${variants[j]} | ${variants[k]}`,
      );
    }
  }
}

// console.log(">>>");
// console.log(deck.map((card, idx) => `${idx}. ${JSON.stringify(card)}`));

console.log(">>> Non-Shuffled");
console.log(JSON.stringify(deck));
shuffle(deck);
console.log(">>> Shuffled");
console.log(JSON.stringify(deck));

// console.log(">>>");
// console.log(deck.map((card, idx) => `${idx}. ${JSON.stringify(card)}`));
