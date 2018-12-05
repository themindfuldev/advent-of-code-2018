const { readFile } = require('./reader');
const {
    SleepingSchedule,
    Guard,
    buildGuards
} = require('./04-common');


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

const findMostFrequentlySleptMinute = guards => {
    const minutesMostSlept = [];

    // Finding the guard which slept the most minutes for every minute
    for (let i = 0; i < 60; i++) {
        const guardsWhichSleptThisMinute = new Map();
        for (let guard of guards.values()) {
            let minutesThisGuardSlept = 0;
            for (let schedule of guard.schedules) {
                minutesThisGuardSlept += +(schedule.minutesSlept.indexOf(i) > -1);
            }
            guardsWhichSleptThisMinute.set(guard.id, minutesThisGuardSlept);
        }

        let zonkedGuardId;
        let maxMinutesSlept = 0;
        for (let [guardId, minutes] of guardsWhichSleptThisMinute.entries()) {
            if (minutes > maxMinutesSlept) {
                maxMinutesSlept = minutes;
                zonkedGuardId = guardId;
            }
        }

        minutesMostSlept[i] = { zonkedGuardId, maxMinutesSlept };
    }

    // Finding the guard which slept the most minutes total
    let zonkedGuardIdTotal;
    let maxMinutesSleptTotal = 0;
    let minuteMostSleptTotal = -1;
    for (let i = 0; i < 60; i++) {
        const { zonkedGuardId, maxMinutesSlept } = minutesMostSlept[i];
        if (maxMinutesSlept > maxMinutesSleptTotal) {
            maxMinutesSleptTotal = maxMinutesSlept;
            zonkedGuardIdTotal = zonkedGuardId;
            minuteMostSleptTotal = i;
        }
    }
    
    return { zonkedGuardIdTotal, minuteMostSleptTotal }
}

(async () => {
    const lines = await readFile('04-input.txt');
    lines.sort();

    const guards = buildGuards(lines);
    const { zonkedGuardIdTotal, minuteMostSleptTotal } = findMostFrequentlySleptMinute(guards);
    
    const solution = +zonkedGuardIdTotal * minuteMostSleptTotal;
    console.log(`The ID of the guard multiplied by the minute is ${solution}`);
})();