const parseInput = lines => {
    const initialStateRegex = /^initial state: (?<initialState>.+)$/;
    const noteRegex = /^(?<pattern>.+) => (?<pot>.)$/;

    const { initialState } = lines[0].match(initialStateRegex).groups;
    const notes = new Map();

    for (let note of lines.slice(2)) {
        const { pattern, pot } = note.match(noteRegex).groups;
        notes.set(pattern, pot);
    }

    return { initialState, notes };
};

const processGeneration = (state, notes) => {
    let { start, pots } = state;
    const n = pots.length;

    let next = '';
    let prefixExtensions = 0;
    let suffixExtensions = 0;
    for (let i = 0; i < n - 2; i++) {
        const segment = pots.substring(i, i + 5);
        if (notes.has(segment)) {
            const pot = notes.get(segment);
            next += pot;

            if (pot === '#') {
                if (i < 2 && prefixExtensions === 0) {
                    prefixExtensions += 2 - i;
                }
                if ((i > n - 6) && suffixExtensions === 0) {
                    suffixExtensions += i - (n - 6);
                }
            } 

        }
        else {
            next += '.';
        }
    }    
    const prefix = '.'.repeat(2 + prefixExtensions);
    const suffix = '.'.repeat(suffixExtensions);

    return {
        start: start - prefixExtensions,
        pots: prefix + next + suffix
    }
};

const processGenerations = (initialState, notes, generations = 1, log = true) => {
    let state = {
        start: -4,
        pots: `....${initialState}....`
    };

    if (log) {
        console.log(state.pots);
    }

    for (let i = 0; i < generations; i++) {
        state = processGeneration(state, notes);
        if (log) {
            console.log(state.pots);
        }
    }

    return state;
}

const sumPots = ({ start, pots }) => {
    const n = pots.length;

    return pots.split('').reduce((sum, pot, i) => sum + (pot === '#' ? i + start : 0), 0);
};

module.exports = {
    parseInput,
    processGeneration,
    processGenerations,
    sumPots
};