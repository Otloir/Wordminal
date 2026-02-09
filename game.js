/*import { rawlist } from "@inquirer/prompts";
import { confirm } from "@inquirer/prompts";
import * as functions from "./game/functions.js";

// Game introduction
await functions.gameIntroduction();

const start = await confirm({ message: "Start Game?" });

if (start) {
  // Difficulty option and random word
  // const difficulty = await functions.difficulty();
  //const word = await functions.getRandomWord();

  // User guess
  //await functions.userGuess(word);
} else {
  // Quit game
  console.log("Goodbye!");
  process.exit();
}
*/


import * as functions from "./game/functions.js";
import { confirm } from "@inquirer/prompts";

await functions.gameIntroduction();

let playAgain = await confirm({ message: "Start Game?" });

while (playAgain) {
  await functions.playGame();

  playAgain = await confirm({
    message: "Would you like to play again?",
  });
}

console.log("Goodbye!");
process.exit();
