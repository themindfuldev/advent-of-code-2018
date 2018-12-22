const { readFile } = require('./reader');
const {
    readInput,
    operations
} = require('./16-common');

const circularIterable = (array) => ({
    array,
    i : -1,
    [Symbol.iterator]() {
        return this;
    },
    next() {
        if (this.array.length > 0) {
            this.i = (this.i + 1) % this.array.length;
            return { 
                value: this.array[this.i]
            }
        }
        else {
            return {
                done: true
            }
        }
    },
    filterArray(filter) {
        this.array = this.array.filter(filter);
        this.i = -1;
    }
});

const determineOpcodes = samples => {   
    const opcodes = [];
    const circularSamples = circularIterable(samples);

    const remainingOperations = { ...operations };

    for (const sample of circularSamples) {
        const { before, instructions, after } = sample;

        const candidates = Object.entries(remainingOperations)
            .map(([name, op]) => ({
                name,
                op,
                result: op(instructions)(before)
            }))
            .filter(({ result }) => result.toString() === after.toString());

        if (candidates.length === 1) {
            const { name, op } = candidates[0];

            const opcode = instructions[0];
            opcodes[opcode] = op;
            delete remainingOperations[name];

            circularSamples.filterArray(({ instructions }) => instructions[0] !== opcode);
        }
    }
    return opcodes;
};

const runProgram = (opcodes, program) => {
    let result = [0, 0, 0, 0];
    for (const instruction of program) {
        const op = opcodes[instruction[0]];
        result = op(instruction)(result);
    }
    return result;
};

(async () => {
    const lines = await readFile('16-input.txt');

    const { samples, program } = readInput(lines);
    const opcodes = determineOpcodes(samples);
    const result = runProgram(opcodes, program);
    
    console.log(`The state of the registers after executing the test program is ${result}`);
})();