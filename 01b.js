const { readFile } = require('./readLines');

(async () => {
    const lines = await readFile('01-input.txt');

    const frequencySet = new Set();
    
    let frequency = 0;
    let didAFrequencyReachTwice = false;

    while (!didAFrequencyReachTwice) {
        for (let line of lines) {
            frequency += Number(line);
            if (frequencySet.has(frequency)) {
                didAFrequencyReachTwice = true;
                break;
            }
            else {
                frequencySet.add(frequency);
            }
        }
    }

    console.log(`The first frequency reached twice is ${frequency}`);
})();
