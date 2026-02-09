// import { rawlist } from "@inquirer/prompts";
import { confirm } from "@inquirer/prompts";
import * as functions from "./game/functions.js";

// Game introduction
await functions.gameIntroduction();

const start = await confirm({ message: "Start Game?" });

if (start) {
  // Difficulty option and random word
  // const difficulty = await functions.difficulty();
  const correctWord = await functions.getRandomWord();

  // User guess
  await functions.userGuess(correctWord);
} else {
  // Quit game
  console.log("Goodbye!");
  process.exit();
}
