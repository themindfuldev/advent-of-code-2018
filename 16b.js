const { readFile } = require('./reader');
const {
    readInput,
    operations
} = require('./16-common');

const determineOpcodes = samples => {   
    const opcodes = [];

    const remainingOperations = new Map(Object.entries(operations));

    let i = 0;
    while (remainingOperations.size > 0) {
        const { before, instructions, after } = samples[i];

        const candidates = [...remainingOperations]
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
            remainingOperations.delete(name);

            samples = samples.filter(({ instructions }) => instructions[0] !== opcode);
            i = 0;
        }

        i = (i + 1) % samples.length;
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