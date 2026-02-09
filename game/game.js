import * as functions from "./functions.js";
import * as menus from "./menus.js";

//Runs one full game session
export async function playGame() {
  //Chooses difficulty
  const selectedDifficulty = await functions.difficulty();


  //Gets a random word for that difficulty
  const word = await functions.getRandomWordByDifficultyName(selectedDifficulty);

  if (!word) {
    console.log("No word found in for this difficulty.");
    return;
  }

  //THIS LINE IS A DEBUG TO MAKE SURE WE GOT A WORD, EUTHANISE BEFORE WE'RE DONE
  console.log(
    "The actual gameplay isn't in yet, but the word you would've been guessing is:",
    word.word
  );

  //Keeping track of guesses
  const { win, guessCount } = await functions.userGuess(word.word, 5);

  //End screen
  await menus.showEndScreen({
    win,
    word: word.word,
    guessCount,
  });

  //Saves session
  await functions.saveSession({
    difficultyId: word.difficulty._id,
    wordId: word._id,
    guessCount,
    win,
  });

  console.log("Session data saved!");
}