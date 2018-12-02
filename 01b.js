const fs = require('fs');
const readline = require('readline');

function readLines(file, onLine, onClose = () => undefined) {
    const reader = readline.createInterface({
        input: fs.createReadStream(file),
        crlfDelay: Infinity
    });

    const promise = new Promise(resolve => {
        reader
            .on('line', line => onLine(line, reader))
            .on('close', () => resolve(onClose()));
    });

    return promise;
}

(async () => {
    const frequencyTable = {};

    let frequency = 0;
    let firstFrequencyReachedTwice;

    const onLine = (line, reader) => {
        if (!firstFrequencyReachedTwice) {
            frequency += Number(line);
            if (frequencyTable[frequency] === 1) {
                firstFrequencyReachedTwice = frequency;
                reader.close();
            }
            else {
                frequencyTable[frequency] = 1;
            }            
        }
    }

    while (!firstFrequencyReachedTwice) {
        await readLines('01-input.txt', onLine);
    }

    console.log(firstFrequencyReachedTwice);
})();
