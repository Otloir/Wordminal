import "dotenv/config";
import figlet from "figlet";


import { connectDB } from "./../src/database.js";
import { rawlist } from "@inquirer/prompts";
import { confirm } from "@inquirer/prompts";
import { select } from "@inquirer/prompts";



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


