import "dotenv/config";
import figlet from "figlet";
import { connectDB } from "./../src/database.js";

import { rawlist } from "@inquirer/prompts";
import { confirm } from "@inquirer/prompts";
import { select } from "@inquirer/prompts";
import { input } from "@inquirer/prompts";
import chalk from "chalk";

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

export async function userGuess(word, maxGuesses = 5) {
  let guessCount = 0;
  let attempt = 1;

  while (attempt <= maxGuesses) {

    const guess = await input({
      message: `Attempt ${attempt}/${maxGuesses} - Guess:`,
    });

    // Only letters allowed
    if (!/^[A-Za-z]+$/.test(guess)) {
      console.log("Only letters are allowed.");
      continue;
    }
    // Must be exatcly 6 letters
    if (guess.length !== 6) {
      console.log("This word must be exactly 6 letters.");
      continue; 
    }

    guessCount++;
    attempt++;

    // Check guess
    const result = checkGuess(guess, word);
    console.log(formatResult(result));

    function formatResult(result) {
  return result
    .map(({ letter, status }) => {
      if (status === "green") return chalk.bgGreen.black(` ${letter} `);
      if (status === "yellow") return chalk.bgYellow.black(` ${letter} `);
      return chalk.bgGray.black(` ${letter} `);
    })
    .join(" ");
}

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


  //Gets a random word for that difficulty
  const word = await getRandomWordByDifficultyName(selectedDifficulty);

  if (!word) {
    console.log("No word found for this difficulty.");
    return;
  }

  //THIS LINE IS A DEBUG TO MAKE SURE WE GOT A WORD, EUTHANISE BEFORE WE'RE DONE
  console.log(
    "The actual gameplay isn't in yet, but the word you would've been guessing is:",
    word.word
  );

  //Keeping track of guesses
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