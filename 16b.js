const { readFile } = require('./reader');
const {
    readSamples,
    operations
} = require('./16-common');

(async () => {
    const lines = await readFile('16-input.txt');

    const samples = readSamples(lines);
    
    console.log(`The value is contained in register 0 after executing the test program is ${registers[0]}`);
})();