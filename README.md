# Lingon

Lingon is a CLI-based (can run solely in the terminal) word guessing game inspired by Wordle, developed by three students for a collaborative Node.js project. The application challenges players to guess six-letter words within five attempts, using color-coded feedback to guide their guesses. It is built entirely with JavaScript and npm packages,


## Features

- Six-letter word puzzles - Increased challenge compared to traditional five-letter variant
- Multiple difficulty levels - Three distinct difficulty settings (Easy, Medium, Hard)
- Color-coded visual feedback - Real-time terminal output using Chalk library
- Strategic gameplay - Increased challenge by only having five guesses for attempt
- Persistent score tracking - MongoDB integration enables historical performance analysis
- Interactive menu system - Intuitive navigation using Inquirer prompts
- Replay functionality - Restart and difficulty adjustment options, choosing a different word each time


## Installation

### 1. clone the repo

```
git clone https://github.com/Otloir/Lingon.git
cd Lingon
```

### 2. Initialize npm
```
npm init -y
```

### 3. Install dependencies

```
npm install chalk @inquirer/prompts figlet dotenv
```

### Alternatively, install packages individually:

```
npm install chalk
npm install @inquirer/prompts
npm install figlet
npm install dotenv
```

### 4. Configure environment variables
Create a .env file in the project root directory with the following configuration:

```
MONGO_URI=your_mongodb_connection_string
```


## Usage
To start the game, type this command in your terminal:

```
node game.js
```


## Gameplay Flow
#### Initialization Phase:

1. The application displays the Lingon title screen

2. Instructions are presented explaining how the game works

3. Player confirms if they are ready to start

4. Player select their preferred difficulty level: Easy, Medium, or Hard

#### Active Gameplay:

5. Player is given five attempts to identify the target six-letter word

6. Each guess is validated against the game dictionary

7. Invalid inputs (incorrect word length or numbers) are rejected without consuming an attempt

8. After each valid guess, the application provides color-coded feedback:
  - Green - Letter is correct and in the correct position
  - Yellow - Letter exists in the target word but in an incorrect position
  - Gray - Letter does not exist in the target word

#### Game Resolution:

9.1. Victory condition: Player successfully deduces the target word

9.2. Loss condition: Player exhausts all five attempts without identifying the word

10. Game statistics are displayed, including the number of attempts used

11. Options are presented to restart the game and change the difficulty


## Technologies

Node.js - JavaScript runtime environment

MongoDB - NoSQL database for persistent data storage

[Chalk](https://www.npmjs.com/package/chalk) - Terminal string styling and colorization

[Inquirer](https://www.npmjs.com/package/@inquirer/prompts) - Interactive command-line user interface

[Figlet](https://www.npmjs.com/package/figlet) - ASCII art text generator

[dotenv](https://www.npmjs.com/package/dotenv) - Environment variable configuration management


## Team

[@Otloir](https://github.com/Otloir)

[@OlofBjorn](https://github.com/OlofBjorn)

[@alebri0616](https://github.com/alebri0616)


## Credits

Original concept inspired by Wordle by Josh Wardle


## License

This project is licensed under the MIT License.

