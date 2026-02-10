import "dotenv/config";
import { connectDB } from "./../src/database.js";
import { select, input } from "@inquirer/prompts";
import chalk from "chalk";


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
      console.log("Only english letters are allowed.");
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
      return {
        win: true,
        guessCount,
      };
    }
  }

  // If all guesses are used
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
