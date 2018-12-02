const fs = require("fs");
const readline = require("readline");

function readLines(file, onLine, onClose) {
    const reader = readline.createInterface({
        input: fs.createReadStream(file)
    });

    const promise = new Promise(resolve => {
        reader
            .on('line', onLine)
            .on('close', () => resolve(onClose()));
    });

    return promise;
}

(async () => {
    let frequency = 0;
    const onLine = line => frequency += Number(line);
    const onClose = () => frequency;

    console.log(await readLines('01-input.txt', onLine, onClose));
})();
