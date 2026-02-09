import "dotenv/config";
import figlet from "figlet";
import { connectDB } from "./../src/database.js";

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
  const selectedDifficulty = await select({
    name: "difficulty",
    message: "Choose difficulty:",
    choices: [
      {
        name: "easy",
        value: "easy",
      },
      {
        name: "medium",
        value: "medium",
      },
      {
        name: "hard",
        value: "hard",
      },
    ],
  });
  return selectedDifficulty;
}

/*export async function getRandomWord() {
  //needs database connection

  const correctWord = "LINGON";
  return correctWord;
}*/

  //Feature that gets a random word by difficulty name
export async function getRandomWordByDifficultyName(difficultyName) {
  const db = await connectDB(); 

  const [word] = await db.collection("words")
    .aggregate([
      {
        $lookup: {
          from: "difficulties",
          localField: "difficultyId",
          foreignField: "_id",
          as: "difficulty"
        }
      },
      { $unwind: "$difficulty" },
      { $match: { "difficulty.name": difficultyName } },
      { $sample: { size: 1 } }
    ])
  .toArray();

  return word ?? null;
    
}

/*export async function userGuess(word) {
  // User input guess
  const guess = await input({ message: `Guess:` });

  // Check if the guess matches the correct word
  const result = checkGuess(guess, word);

  console.log(result);

  if (guess.toUpperCase() === word.toUpperCase()) {
    console.log("You won!");
    return true;
  } else {
    console.log(`Game over! The word was ${word}`);
    return false;
  }
}
*/

export async function userGuess(word, maxGuesses = 5) {
  let guessCount = 0;

  for (let i = 1; i <= maxGuesses; i++) {
    guessCount++;

    // User input guess
    const guess = await input({
      message: `Attempt ${i}/${maxGuesses} - Guess:`,
    });

    // Check guess
    const result = checkGuess(guess, word);
    console.log(result);

    if (guess.toUpperCase() === word.toUpperCase()) {
      console.log("You won!");
      return {
        win: true,
        guessCount,
      };
    }
  }

  // If all guesses are used
  console.log(`Game over! The word was ${word}`);
  return {
    win: false,
    guessCount: maxGuesses,
  };
}


function checkGuess(guess, word) {
  const answer = word.toUpperCase();
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

export async function saveSession({ difficultyId, wordId, guessCount, win }) {
  const db = await connectDB();

  const result = await db.collection("sessions").insertOne({
    difficultyId,
    wordId,
    guessCount,
    win,
  });

  return result.insertedId;
}

// Temporary placeholder mock gameplay loop (before real gameplay exists)
/*export async function mockGameplay(maxGuesses = 5) {
  let guessCount = 0;

  for (let i = 1; i <= maxGuesses; i++) {
    guessCount++;

    //Fake guess mechanism
    const guessedCorrectly = await confirm({
      message: `Attempt ${i}/${maxGuesses}: Did you guess the word correctly?`,
    });

    if (guessedCorrectly) {
      return {
        win: true,
        guessCount,
      };
    }
  }

  //Loses the game if all guesses are failed
  return {
    win: false,
    guessCount: maxGuesses,
  };
}*/

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

  //Runs one full game session
export async function playGame() {
  //Chooses difficulty
  const selectedDifficulty = await difficulty();

  //console.log("TESTING");

  //Gets a random word for that difficulty
  const word = await getRandomWordByDifficultyName(selectedDifficulty);

  if (!word) {
    console.log("No word found for this difficulty.");
    return;
  }

  console.log(
    "The actual gameplay isn't in yet, but the word you would've been guessing is:",
    word.word
  );

  //Temporary mock gameplay thing that keepts track of guesses
  const { win, guessCount } = await userGuess(word.word, 5);

  //End screen
  await showEndScreen({
    win,
    word: word.word,
    guessCount,
  });

  //Saves session
  await saveSession({
    difficultyId: word.difficulty._id,
    wordId: word._id,
    guessCount,
    win,
  });

  console.log("Session data saved!");
}