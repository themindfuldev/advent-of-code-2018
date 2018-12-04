const { readFile } = require('./readLines');

class SleepingSchedule {
    constructor(guard) {
        this.guard = guard;
        this.guard.schedules.push(this);

        this.minutesSlept = [];
    }

    setDate(year, month, day) {
        this.year = year;
        this.month = month;
        this.day = day;
    }

    addNap(start, end) {
        const length = end - start;
        this.minutesSlept.push(...Array.from({length}, (e, i) => start + i));
        this.guard.maxMinutesSlept += length;
    }
}

class Guard {
    constructor(id) {
        this.id = id;
        this.maxMinutesSlept = 0;
        this.schedules = [];
    }
}

const buildGuards = lines => {
    const beginsShiftRegex = /^\[(?<year>\d+)-(?<month>\d+)-(?<day>\d+)\s(?<hour>\d+):(?<minute>\d+)\]\sGuard\s#(?<id>\d+) begins shift$/;
    const fallsAsleepRegex = /^\[(?<year>\d+)-(?<month>\d+)-(?<day>\d+)\s(?<hour>\d+):(?<minute>\d+)\]\sfalls\sasleep$/;
    const wakesUpRegex = /^\[(?<year>\d+)-(?<month>\d+)-(?<day>\d+)\s(?<hour>\d+):(?<minute>\d+)\]\swakes\sup$/;

    const sleepingSchedules = new Map();
    const guards = new Map();

    let currentSchedule;
    let hasNapped;
    let napStartMinute;
    let currentGuard;
    for (let line of lines) {
        let match = line.match(beginsShiftRegex);
        if (match) {
            if (napStartMinute) {
                currentSchedule.addNap(napStartMinute, 60);
            }

            const { id } = match.groups;

            if (guards.has(id)) {
                currentGuard = guards.get(id);
            }
            else {
                currentGuard = new Guard(id);
                guards.set(id, currentGuard);
            }
            currentSchedule = new SleepingSchedule(currentGuard);

            hasNapped = false;
            napStartMinute = undefined;
        }
        else {
            match = line.match(fallsAsleepRegex);
            if (match) {
                if (!hasNapped) {
                    const { year, month, day } = match.groups;
                    currentSchedule.setDate(year, month, day);
                    hasNapped = true;
                }
                const { minute } = match.groups;
                napStartMinute = +minute;
            }
            else {
                match = line.match(wakesUpRegex);
                if (match) {
                    const { minute } = match.groups;
                    currentSchedule.addNap(napStartMinute, +minute);
                    napStartMinute = undefined;
                }
            }
        }
    }
    return guards;
};

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

const findMostFrequentlySleptMinute = guards => {
    const minutesMostSlept = [];
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