const { readFile } = require('./reader');

const {
    MAP,
    tick,
    serialize,
    printSolution
} = require('./18-common');

(async () => {
    let outskirts = (await readFile('18-input.txt')).map(row => row.split(''));
    
    const previousStates = new Map();
    let elapsedMinutes = 0;
    let serialized;
    let hasDetectedLoop = false;
    do {
        elapsedMinutes++;
        outskirts = tick(outskirts);

        serialized = serialize(outskirts);
        if (previousStates.has(serialized)) {
            hasDetectedLoop = true;
        }
        else {
            previousStates.set(serialized, elapsedMinutes);
        }
    } while (!hasDetectedLoop);
    
    console.log(`Loop detected at minute ${elapsedMinutes}!`);
    
    const firstRepetitionMinutes = previousStates.get(serialized);
    const loopDurationMinutes = elapsedMinutes - firstRepetitionMinutes;
    const equivalentMinute = ((1000000000 - firstRepetitionMinutes) % loopDurationMinutes) + firstRepetitionMinutes;

    console.log(`The minute 1000000000 is equivalent to the minute ${equivalentMinute}`);

    const solution = [...previousStates.entries()].find(([state, minute]) => minute === equivalentMinute)[0];

    printSolution(solution);
})();