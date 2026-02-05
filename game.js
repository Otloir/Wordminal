import { rawlist } from "@inquirer/prompts";
import { confirm } from "@inquirer/prompts";
import * as functions from "./game/functions.js";

// Game introduction
await functions.gameIntroduction();

const start = await confirm({ message: "Start Game?" });

if (start) {
  // Difficulty option
  await functions.difficulty();
} else {
  // Quit game
  console.log("Goodbye!");
  process.exit();
}
