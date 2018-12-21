const { readFile } = require('./reader');
const {
    readSamples,
    operations
} = require('./16-common');

const evaluateSamples = samples => {
    let numberOfSamples = 0;

    for (let sample of samples) {
        const { before, instructions, after } = sample;

        const opcodes = Object.values(operations)
            .map(op => op(instructions)(before))
            .filter(result => result.toString() === after.toString()).length;

        if (opcodes >= 3) numberOfSamples += 1;
    }
    return numberOfSamples;
};

(async () => {
    const lines = await readFile('16-input.txt');

    const samples = readSamples(lines);
    const numberOfSamples = evaluateSamples(samples);

    console.log(`The number of samples with three or more opcodes is ${numberOfSamples}`);    
})();