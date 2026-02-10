import figlet from "figlet";
import chalk from "chalk";

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

