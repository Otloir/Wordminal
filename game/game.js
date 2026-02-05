import { rawlist } from "@inquirer/prompts";
import { confirm } from "@inquirer/prompts";
import figlet from "figlet";

// Game introduction

async function gameIntroduction() {
  const text = await figlet.text("Lingon!");
  console.log(text);

  console.log(
    "Welcome to the Lingon! This is a Wordly inspired game! In Lingon, you get to guess a 6 letter word 5 times. If you get a letter correct in the right spot, it will turn green. If you get a letter correct but not in the right spot, it will turn yellow. And if the letters are not in the word, they will trun gray. If every letter turns green, you have won the game. Good luck!",
  );
}

await gameIntroduction();

const start = await confirm({ message: "Start Game?" });

if (start) {
  // Difficulty option
  const difficulty = await rawlist({
    name: "difficulty",
    message: "Choose difficulty:",
    choices: [
      {
        name: "easy",
        value: "1",
      },
      {
        name: "medium",
        value: "2",
      },
      {
        name: "hard",
        value: "3",
      },
    ],
  });
} else {
  console.log("Goodbye!");
  process.exit();
}



// checks