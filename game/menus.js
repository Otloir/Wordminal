import figlet from "figlet";
import chalk from "chalk";
import { select } from "@inquirer/prompts";
import * as functions from "./functions.js";

// game introduction and and title
export async function gameIntroduction() {
  const text = await figlet.text("Lingon!");
  console.log(chalk.bold.red(text));

  console.log(
    "Welcome to the Lingon! This is a Wordly inspired game! In Lingon, you get to guess a 6 letter word 5 times. If you get a letter correct in the right spot, it will turn green. If you get a letter correct but not in the right spot, it will turn yellow. And if the letters are not in the word, they will trun gray. If every letter turns green, you have won the game. Good luck!",
  );
}


// End screen
export async function showEndScreen({ win, word, guessCount }) {
  const text = await figlet.text(win ? "YOU WIN" : "YOU LOSE");
  console.log(text);

  console.log(`The correct word was: ${word}`);
  console.log(`Attempts used: ${guessCount}`);

  if (win) {
    console.log("Congratulations! You won!");
  } else {
    console.log("Better luck next time!");
  }
}

export async function showWins(wins) {
  console.log(chalk.bold("\nYour Winning Games\n"));

  if (wins.length === 0) {
    console.log("You haven't won any games yet.");
    return;
  }

  wins.forEach((win, index) => {
    console.log(
      `${index + 1}. ${chalk.green(win.word)} | ` +
      `Difficulty: ${chalk.yellow(win.difficulty)} | ` +
      `Guesses: ${win.guessCount}`
    );
  });

  console.log(""); //spacing
}

export async function showLast10Sessions(sessions) {
  console.log("\nYour Last 10 Games\n");

  if (sessions.length === 0) {
    console.log("No games played yet.");
    return;
  }

  sessions.forEach((session, index) => {
    const result = session.win ? "WIN" : "LOSS";

    console.log(
      `${index + 1}. ${session.word} | ` +
      `Difficulty: ${session.difficulty} | ` +
      `Guesses: ${session.guessCount} | ` +
      `Result: ${result}`
    );
  });

  console.log("");
}


export async function statsMenu() {
  let back = false;

  while (!back) {
    const choice = await select({
      message: "Stats Menu - What would you like to view?",
      choices: [
        { name: "View All Wins", value: "wins" },
        { name: "View Last 10 Games", value: "last10" },
        { name: "Back", value: "back" },
      ],
    });

    switch (choice) {
      case "wins": {
        const wins = await functions.getWinningSessions();
        await showWins(wins);
        break;
      }

      case "last10": {
        const sessions = await functions.getLast10Sessions();
        await showLast10Sessions(sessions);
        break;
      }

      case "back":
        back = true;
        break;
    }
  }
}
