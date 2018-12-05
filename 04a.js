const { readFile } = require('./reader');
const {
    SleepingSchedule,
    Guard,
    buildGuards
} = require('./04-common');

const findZonkedGuard = guards => {
    return [...guards.values()].reduce((zonkedGuard, guard) => {
        if (guard.maxMinutesSlept > zonkedGuard.maxMinutesSlept) {
            zonkedGuard = guard;
        }
        return zonkedGuard;
    });
};

const findMostAsleepMinute = guard => {
    const minutesCount = Array.from({ length: 60 }, m => 0);
    for (let i = 0; i < 60; i++) {
        for (let schedule of guard.schedules) {
            minutesCount[i] += +(schedule.minutesSlept.indexOf(i) > -1);
        }
    }

    const mostAsleepMinuteCount = Math.max(...minutesCount);
    return minutesCount.indexOf(mostAsleepMinuteCount);
};

(async () => {
    const lines = await readFile('04-input.txt');
    lines.sort();

    const guards = buildGuards(lines);
    const zonkedGuard = findZonkedGuard(guards);
    const mostAsleepMinute = findMostAsleepMinute(zonkedGuard);
    
    const solution = +zonkedGuard.id * mostAsleepMinute;
    console.log(`The ID of the guard multiplied by the minute is ${solution}`);
})();