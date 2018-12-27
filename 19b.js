const { readFile } = require('./reader');
const {
    readInput,
    runProgram,
    analyzeProgram
} = require ('./19-common');

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
