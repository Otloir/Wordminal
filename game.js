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
