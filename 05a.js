const { readFile } = require('./reader');
const { reactPolymer } = require('./05-common');

(async () => {
    const lines = await readFile('05-input.txt');

    const polymer = reactPolymer(lines[0]);

    console.log(`The remaining units are ${polymer.length}`);
})();