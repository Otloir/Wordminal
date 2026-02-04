import { rawlist } from "@inquirer/prompts";

console.log(
  "Welcome to the Lingon! This is a Wordly inspired game! In Lingon, you get to guess a 6 letter word 5 times. If you get a letter correct in the right spot, it will turn green. If you get a letter correct but not in the right spot, it will turn yellow. And if the letters are not in the word, they will trun gray. If every letter turns green, you have won the game. Good luck!",
);
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

