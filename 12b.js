const { readFile } = require('./reader');
const {
    parseInput,
    processGeneration,
    processGenerations,
    sumPots
} = require('./12-common');

(async () => {
    const lines = await readFile('12-input.txt');

    const { initialState, notes } = parseInput(lines);
    
    const initialBatch = processGenerations(initialState, notes, 160, false);
    const initialSum = sumPots(initialBatch);
    console.log(`The sum for the first 160 batch is ${initialSum}`);

    const diffBatch = processGeneration(initialBatch, notes);
    const diffSum = sumPots(diffBatch) - initialSum;
    console.log(`The sum for the just 1 generation is ${diffSum}`);

    const totalSum = initialSum + diffSum * (50000000000 - 160);
    console.log(`The total sum is ${totalSum}`);
})();