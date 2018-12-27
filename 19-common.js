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
    const frequency = new Set();
    let lastSolution;
    while (ip >= 0 && ip < n) {
        const instruction = program[ip];
        const op = operations[instruction[0]];
        registers = op(instruction)(registers);
        ip = ++registers[ipRegister];
        i++;
        if (ip === 28) {            
            if (frequency.has(registers[5])) {
                console.log(`solution is ${lastSolution}!`);    
                return;
            }
            else  {
                lastSolution = registers[5];
                frequency.add(lastSolution);
            }
        }
    }

    return registers;
};

const analyzeProgram = (ipRegister, program) => {
    for (let i = 0; i < program.length; i++) {
        const [op, a, b, c] = program[i];
        let analysis;
        const target = c === ipRegister ? 'jumps ip to ' : `[${c}] = `;
        if (op === 'addi') { //result[c] = registers[a] + b; 
            analysis = target + `[${a}] + ${b}`;
        }
        else if (op === 'addr') { //result[c] = registers[a] + registers[b]; 
            analysis = target + `[${a}] + [${b}]`;
        }
        else if (op === 'seti') { //result[c] = a; 
            analysis = target + `${a}`;
        }
        else if (op === 'setr') { //result[c] = registers[a]; 
            analysis = target + `[${a}]`;
        }
        else if (op === 'muli') { //result[c] = registers[a] * b; 
            analysis = target + `[${a}] * ${b}`;
        }
        else if (op === 'mulr') { //result[c] = registers[a] * registers[b]; 
            analysis = target + `[${a}] * [${b}]`;
        }
        else if (op === 'eqri') { //result[c] = registers[a] === b ? 1 : 0; 
            analysis = target + `1 if [${a}] === ${b} or 0 otherwise`;
        }
        else if (op === 'eqrr') { //result[c] = registers[a] === registers[b] ? 1 : 0;
            analysis = target + `1 if [${a}] === [${b}] or 0 otherwise`;
        }
        else if (op === 'gtir') { //result[c] = a > registers[b] ? 1 : 0; 
            analysis = target + `1 if ${a} > [${b}] or 0 otherwise`;
        }
        else if (op === 'gtrr') { //result[c] = registers[a] > registers[b] ? 1 : 0; 
            analysis = target + `1 if [${a}] > [${b}] or 0 otherwise`;
        }
        else if (op === 'bani') { //result[c] = registers[a] & b; 
            analysis = target + `[${a}] & ${b}`;
        }
        else if (op === 'bori') { //result[c] = registers[a] | b; 
            analysis = target + `[${a}] | ${b}`;
        }
        console.log(`${i}: ${analysis}`);
    }
};

module.exports = {
    readInput,
    runProgram,
    analyzeProgram
};