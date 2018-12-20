const { readFile } = require('./reader');
const {
    readDungeon,
    makeRound,
    howManyElves,
    howManyGoblins,
    printStats,
    getOutcome  
} = require('./15-common');



(async () => {
    const lines = await readFile('15-input.txt');

    const { dungeon, units } = readDungeon(lines);

    let initialElves = howManyElves(units);
    let elves = initialElves;
    let goblins = howManyGoblins(units);
    let rounds = 0;
    let ap = 3;
    
    while (elves === initialElves && goblins > 0) {
        ap++;


        const hasCombatEndedEarly = makeRound(dungeon, units);
        if (!hasCombatEndedEarly) rounds++;

        goblins = howManyGoblins(units);
        elves = howManyElves(units);

        printStats(rounds, dungeon, units);
    } while (goblins > 0 && elves > 0);

    console.log(`The ${goblins > 0 ? 'goblins': 'elves'} won!`);
    console.log(`The outcome of the combat is ${getOutcome(rounds, units)}`);
})();