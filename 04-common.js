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
        this.minutesSlept.push(...Array.from({ length }, (e, i) => start + i));
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

module.exports = { 
    SleepingSchedule,
    Guard,
    buildGuards
};