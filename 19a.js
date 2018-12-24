const { readFile } = require('./reader');
const {
    readInput,
    runProgram
} = require ('./19-common');

(async () => {
    const lines = await readFile('19-input.txt');

    const { ipRegister, program } = readInput(lines);

    const result = runProgram(ipRegister, program, [0, 0, 0, 0, 0, 0]);
    
    console.log(`The state of the registers after executing the test program is ${result}`);
})();
