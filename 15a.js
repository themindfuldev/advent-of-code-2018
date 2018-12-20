const { readFile } = require('./reader');
const {
    readDungeon,
    makeRound,
    getGoblins,
    getElves,
    printStats,
    getOutcome  
} = require('./15-common');

(async () => {
    const lines = await readFile('15-input.txt');

    const { dungeon, units } = readDungeon(lines);

    let goblins, elves, rounds = 0;
    do {
        const hasCombatEndedEarly = makeRound(dungeon, units);
        if (!hasCombatEndedEarly) rounds++;

        goblins = getGoblins(units).length;
        elves = getElves(units).length;

        printStats(rounds, dungeon, units);
    } while (goblins > 0 && elves > 0);

    console.log(`The ${goblins > 0 ? 'goblins': 'elves'} won!`);
    console.log(`The outcome of the combat is ${getOutcome(rounds, units)}`);
})();