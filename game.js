import * as menus from "./game/menus.js";
import * as game from "./game/game.js";
import { select } from "@inquirer/prompts";

await menus.gameIntroduction();

let exit = false;

while (!exit) {
  const choice = await select({
    message: "What would you like to do?",
    choices: [
      { name: "Start Game", value: "play" },
      { name: "View Stats", value: "stats" },
      { name: "Exit", value: "exit" },
    ],
  });

  switch (choice) {
    case "play":
      await game.playGame();
      break;

    case "stats": {
      await menus.statsMenu();
      break;
    }

    case "exit":
      exit = true;
      break;
  }
}

console.log("Goodbye!");
process.exit();