const { readFile } = require('./reader');

const {
    parseInput,
    getPlayerScores
} = require('./09-common');

(async () => {
    const lines = await readFile('09-input.txt');

    const { players, marbles } = parseInput(lines[0]);

    const playerScores = getPlayerScores(players, marbles);

    const highScore = Math.max(...playerScores.values());

    console.log(`The highest score is ${highScore}`);
})();