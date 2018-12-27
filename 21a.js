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
        //console.log(`${i}: [${ipRegister}] = [${ipRegister}] + 1`);
    }
};

(async () => {
    const lines = await readFile('21-input.txt');

    const { ipRegister, program } = readInput(lines);

    const result = runProgram(ipRegister, program, [11162884, 0, 0, 0, 0, 0]);

    //analyzeProgram(ipRegister, program);

    // let register0 = 0;
    // while (true) {
    //     console.log(`with register 0 = ${register0}...`);
    //     const result = runProgram(ipRegister, program, [register0++, 0, 0, 0, 0, 0]);        
    // }
    
    //console.log(`The state of the registers after executing the test program is ${result}`);
})();
