import { Doc } from "../_generated/dataModel";
import { shuffle } from "./utility";

export type ContractDeck = Doc<"gameState">["contractDeck"];

const contractDeck: ContractDeck = [
  {
    id: "",
    title: "Midnight Mosh",
    type: "Concert",
    description:
      "A rock concert under the full moon needs a monster with killer guitar skills and a howling voice to headline the event.",
  },
  {
    id: "",
    title: "Ghoul's Got Talent",
    type: "Talent Show",
    description:
      "A prime-time talent show where only the most spine-tingling performances make it to the finals. Bring your scariest acts!",
  },
  {
    id: "",
    title: "Scream Queens",
    type: "Horror Movie",
    description:
      "A chilling horror movie looking for a lead actress with a blood-curdling scream and the ability to send shivers down spines.",
  },
  {
    id: "",
    title: "Monster Mashup",
    type: "Music Video",
    description:
      "A high-energy music video production seeking a monster with dance moves that can light up the night and a look that stands out.",
  },
  {
    id: "",
    title: "Spooktacular Showdown",
    type: "Game Show",
    description:
      "A new game show where monsters compete in a series of spooky challenges. Only the most versatile performer can take home the prize.",
  },
  {
    id: "",
    title: "Comedy Crypt",
    type: "Stand-Up Comedy",
    description:
      "A late-night comedy gig in a haunted club. We need a monster with a sharp wit and the ability to deliver deadpan humor.",
  },
  {
    id: "",
    title: "Enchanted Evening",
    type: "Theater Production",
    description:
      "An off-Broadway show blending magic and music, requiring a monster with enchanting singing abilities and a touch of the mystical.",
  },
  {
    id: "",
    title: "Nightmare on Elm Street Musical",
    type: "Musical",
    description:
      "A reimagined musical version of the classic horror film, calling for a monster who can sing, dance, and haunt the dreams of the audience.",
  },
  {
    id: "",
    title: "Fright Night Live",
    type: "Live Performance",
    description:
      "A live Halloween special looking for a monster to take center stage with a spooky story or eerie musical performance.",
  },
  {
    id: "",
    title: "Underground Beats",
    type: "DJ Gig",
    description:
      "An underground rave in a haunted subway station is seeking a monster DJ who can mix beats that keep the undead dancing till dawn.",
  },
  {
    id: "",
    title: "Spooky Saturday Morning Cartoons",
    type: "Voice Acting",
    description:
      "A new animated series for kids, needing a monster with a range of voices to bring to life a cast of creepy yet lovable characters.",
  },
  {
    id: "",
    title: "Haunted House Renovation",
    type: "Reality TV Show",
    description:
      "A spooky twist on home renovation shows, looking for a monster who can work with both tools and tormented spirits.",
  },
  {
    id: "",
    title: "Fang-tastic Fashion",
    type: "Fashion Show",
    description:
      "A gothic fashion show during Fashion Week, seeking a monster model with the perfect dark and brooding look to strut the runway.",
  },
  {
    id: "",
    title: "Cryptic Cooking",
    type: "Cooking Show",
    description:
      "A cooking show that focuses on dishes with a dark twist, needing a monster chef with a flair for the dramatic and a taste for the bizarre.",
  },
  {
    id: "",
    title: "Monster Mashup Battle",
    type: "Dance Competition",
    description:
      "A high-stakes dance battle where only the monster with the most electrifying moves can claim the crown.",
  },
  {
    id: "",
    title: "Spine-Tingling Stories",
    type: "Storytelling Event",
    description:
      "A storytelling competition in a candle-lit crypt, looking for a monster with a talent for weaving tales that leave the audience on the edge of their seats.",
  },
  {
    id: "",
    title: "The Big Scream",
    type: "Haunted Attraction",
    description:
      "A new haunted house attraction needs a monster with the perfect blend of terror and showmanship to lead guests through a nightmarish experience.",
  },
  {
    id: "",
    title: "Monstrous Movie Marathon",
    type: "Film Festival",
    description:
      "A film festival showcasing monster flicks, seeking a monster with a background in acting or special effects to host the event.",
  },
  {
    id: "",
    title: "Cursed Cabaret",
    type: "Cabaret Show",
    description:
      "A cabaret show with a dark twist, requiring a monster with sultry vocals and a flair for the dramatic.",
  },
  {
    id: "",
    title: "Crypt Keeper Chronicles",
    type: "Podcast Series",
    description:
      "A popular podcast is searching for a monster with a chilling voice and a knack for horror stories to narrate their latest series.",
  },
];

function shuffleContractDeck(deck: ContractDeck): ContractDeck {
  return (shuffle(deck) as ContractDeck).map((card) => ({
    ...card,
    id: crypto.randomUUID(),
  }));
}

export function createShuffledContractDeck(): ContractDeck {
  return shuffleContractDeck(Array.from(contractDeck));
}
