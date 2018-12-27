const {
    operations
} = require('./16-common');

const readInput = lines => {
    const ipRegex = /^#ip (?<ipRegister>\d)$/;
    const instructionRegex = /^(?<op>\w+) (?<a>\d+) (?<b>\d+) (?<c>\d+)$/;

    let ipRegister;
    const program = [];
    for (const line of lines) {
        if (ipRegister === undefined) {
            const match = line.match(ipRegex);
            if (match) {
                ipRegister = +match.groups.ipRegister;
            }
        }
        else {
            const match = line.match(instructionRegex);
            if (match) {
                const { op, a, b, c } = match.groups;
                program.push([op, +a, +b, +c]);
            }
        }
    }
    return { ipRegister, program };
};

const runProgram = (ipRegister, program, registers) => {
    const n = program.length;
    let ip = registers[ipRegister];
    let i = 0;
    while (ip >= 0 && ip < n) {
        const instruction = program[ip];
        const op = operations[instruction[0]];
        registers = op(instruction)(registers);
        ip = ++registers[ipRegister];
        i++;
        if (ip === 28) {
            console.log(`${i}: register[5] = ${registers[5]}`);
        }
        //i % 10000000 === 0 && console.log(`${i}, ${registers.join(',')}`);
    }

    console.log(`finished with i = ${i} and registers=${registers}`);

    return registers;
};

module.exports = {
    readInput,
    runProgram
};