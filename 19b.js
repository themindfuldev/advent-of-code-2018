const { readFile } = require('./reader');
const {
    readInput,
    runProgram
} = require ('./19-common');

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
        else if (op === 'eqrr') { //result[c] = registers[a] === registers[b] ? 1 : 0;
            analysis = target + `1 if [${a}] === [${b}] or 0 otherwise`;
        } 
        else if (op === 'gtrr') { //result[c] = registers[a] > registers[b] ? 1 : 0; 
            analysis = target + `1 if [${a}] > [${b}] or 0 otherwise`;
        } 
        console.log(`${i}: ${analysis}`);
    }
};

const runOptimizedProgram = () => {
    const number = 10551298;
    let sumDivisors = 0;
    for (let i = 1; i <= number; i++) {
        if (number % i === 0) {
            sumDivisors += i;
        }
    }
    return sumDivisors;
}

(async () => {
    const lines = await readFile('19-input.txt');

    //const { ipRegister, program } = readInput(lines);
    //analyzeProgram(ipRegister, program);
    //const result = runProgram(ipRegister, program, [1, 0, 0, 0, 0, 0]);
    
    const result = runOptimizedProgram();
    console.log(`The state of the registers after executing the test program is ${result}`);
})();
