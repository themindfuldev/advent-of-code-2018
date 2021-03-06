const { readFile } = require('./reader');
const {
    operations
} = require('./16-common');
const {
    readInput,
    analyzeProgram
} = require ('./19-common');

const runProgram = (ipRegister, program) => {
    let registers = [0, 0, 0, 0, 0, 0];
    const n = program.length;
    let ip = registers[ipRegister];
    while (ip >= 0 && ip < n) {
        const instruction = program[ip];
        const op = operations[instruction[0]];
        registers = op(instruction)(registers);
        ip = ++registers[ipRegister];
        if (ip === 28) {            
            return registers[5];
        }
    }

    return registers[5];
};

(async () => {
    const lines = await readFile('21-input.txt');

    const { ipRegister, program } = readInput(lines);
    
    //analyzeProgram(ipRegister, program);

    const solution = runProgram(ipRegister, program);

    console.log(`The lowest non-negative integer value for register 0 that causes the program to halt after executing the fewest instructions is ${solution}.`);
})();
