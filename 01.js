const fs = require('fs');
const readline = require('readline');

function readLines(file, onLine) {
    const reader = readline.createInterface({
        input: fs.createReadStream(file),
        crlfDelay: Infinity
    });

    reader.on('line', onLine);

    return new Promise(resolve => reader.on('close', resolve));
}

(async function part1() {
    let frequency = 0;
    const onLine = line => frequency += Number(line);

    await readLines('01-input.txt', onLine);

    console.log(`The final frequency is ${frequency}`);
})();

(async function part2() {
    const frequencySet = new Set();

    let frequency = 0;
    let didAFrequencyReachTwice = false;
    const onLine = function (line) {
        if (!didAFrequencyReachTwice) {
            frequency += Number(line);
            if (frequencySet.has(frequency)) {
                didAFrequencyReachTwice = true;
                this.close();
            }
            else {
                frequencySet.add(frequency);
            }
        }
    }

    while (!didAFrequencyReachTwice) {
        await readLines('01-input.txt', onLine);
    }

    console.log(`The first frequency reached twice is ${frequency}`);
})();
