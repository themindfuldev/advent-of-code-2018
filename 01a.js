const { readFile } = require('./reader');

(async () => {
    const lines = await readFile('01-input.txt');

    const frequency = lines.reduce((frequency, line) => frequency + Number(line), 0);

    console.log(`The final frequency is ${frequency}`);
})();