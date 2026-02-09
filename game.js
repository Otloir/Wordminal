//import * as functions from "./game/functions.js";
import * as menus from "./game/menus.js";
import * as game from "./game/game.js";
import { confirm } from "@inquirer/prompts";

await menus.gameIntroduction();

let playAgain = await confirm({ message: "Start Game?" });

while (playAgain) {
  await game.playGame();

  playAgain = await confirm({
    message: "Would you like to play again?",
  });
}

console.log("Goodbye!");
process.exit();
