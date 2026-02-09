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

  for (let i = 0; i < userGuess.length; i++) {
    if (userGuess[i] === answer[i]) {
      result[i] = { letter: userGuess[i], status: "green" };
      splitAnwser[i] = null;
    }
  }

  for (let i = 0; i < userGuess.length; i++) {
    if (result[i]) continue;
    const splitGuess = splitAnwser.indexOf(userGuess[i]);
    result[i] = {
      letter: userGuess[i],
      status: splitGuess !== -1 ? "yellow" : "gray",
    };
    if (splitGuess !== -1) splitAnwser[splitGuess] = null;
  }

  return result;
}
