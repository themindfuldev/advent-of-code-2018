const { readFile } = require('./reader');
const {
    parseInput,
    processGenerations,
    sumPots
} = require('./12-common');

(async () => {
    const lines = await readFile('12-input.txt');

    const { initialState, notes } = parseInput(lines);
    
    const lastGeneration = processGenerations(initialState, notes, 20, false);

    const potsSum = sumPots(lastGeneration);

    console.log(`The sum of the numbers of all pots is ${potsSum}`);
})();