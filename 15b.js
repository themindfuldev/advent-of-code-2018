const { readFile } = require('./reader');
const {
    readDungeon,
    makeRound,
    getElves,
    getGoblins,
    printStats,
    getOutcome  
} = require('./15-common');



(async () => {
    const lines = await readFile('15-input.txt');

    let ap = 3;
    let areAllElvesAlive;
    do {
        ap++;
        console.log(`\nWith AP as ${ap}:`);

        const { dungeon, units } = readDungeon(lines);
        const elves = getElves(units);
        elves.forEach(elf => elf.ap = ap);

        let initialElvesCount = elves.length;
        let elvesCount, goblinsCount;

        let rounds = 0;
        do {
            console.log(`AP ${ap}, round ${rounds+1}`);
            const hasCombatEndedEarly = makeRound(dungeon, units);
            if (!hasCombatEndedEarly) rounds++;            

            goblinsCount = getGoblins(units).length;
            elvesCount = getElves(units).length;
            areAllElvesAlive = elvesCount === initialElvesCount;
        } while (areAllElvesAlive && goblinsCount > 0);

        printStats(rounds, dungeon, units);

        if (areAllElvesAlive) {
            console.log(`\nAll elves survived when AP is ${ap}`);
            console.log(`The outcome of the last combat is ${getOutcome(rounds, units)}`);
        }
        else {
            console.log(`There was an elf casualty!`);
        }        
    } while (!areAllElvesAlive);    
})();