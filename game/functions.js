import figlet from "figlet";
import { rawlist } from "@inquirer/prompts";
import { confirm } from "@inquirer/prompts";
import { select } from "@inquirer/prompts";
import { input } from "@inquirer/prompts";

// game introduction and and title
export async function gameIntroduction() {
  const text = await figlet.text("Lingon!");
  console.log(text);

  console.log(
    "Welcome to the Lingon! This is a Wordly inspired game! In Lingon, you get to guess a 6 letter word 5 times. If you get a letter correct in the right spot, it will turn green. If you get a letter correct but not in the right spot, it will turn yellow. And if the letters are not in the word, they will trun gray. If every letter turns green, you have won the game. Good luck!",
  );
}

// choose difficylty
export async function difficulty() {
  const difficulty = await select({
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
}

export async function getRandomWord() {
  //needs database connection

  const correctWord = "LINGON";
  return correctWord;
}

export async function userGuess(correctWord) {
  // User input guess
  const guess = await input({ message: `Guess:` });

  // Check if the guess matches the correct word
  const result = checkGuess(guess, correctWord);

  console.log(result);

  // If player won or not
  if (guess.toUpperCase() === correctWord.toUpperCase()) {
    console.log("You won!");
    return true;
  } else {
    console.log(`Game over! The word was ${correctWord}`);
    return false;
  }
}

function checkGuess(guess, correctWord) {
  const answer = correctWord.toUpperCase();
  const userGuess = guess.toUpperCase();
  const result = [];
  const splitAnwser = answer.split("");

  // checks if the letter correct and in the right place
  for (let i = 0; i < userGuess.length; i++) {
    const guessedLetter = userGuess[i];
    const correctLetter = answer[i];

    if (guessedLetter === correctLetter) {
      result[i] = { letter: guessedLetter, status: "green" }; // letter is correct and in the right place
      splitAnwser[i] = null;
    }
  }

  // checks if the letter exists in the word
  for (let i = 0; i < userGuess.length; i++) {
    if (result[i]) {
      continue;
    }

    const guessedLetter = userGuess[i];

    const position = splitAnwser.indexOf(guessedLetter);

    if (position !== -1) {
      result[i] = { letter: guessedLetter, status: "yellow" }; // letter exists in the word
      splitAnwser[position] = null;
    } else {
      result[i] = { letter: guessedLetter, status: "gray" }; // letter is inccorrect
    }
  }

  return result;
}
