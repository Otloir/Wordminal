import { rawlist } from '@inquirer/prompts';


const answer = await rawlist({
  name: "RPS",
  message: "Choose what you play:",
  choices: [
    {
      name: "Rock",
      value: "rock",
    },
    {
      name: "Paper",
      value: "paper",
    },
    {
      name: "Scissors",
      value: "scissors",
    },
  ],
});
