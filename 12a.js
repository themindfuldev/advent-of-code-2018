const { readFile } = require('./reader');

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
    let { current } = state;
    const n = current.length;

    let next = '';
    let prefixExtensions = 0;
    let suffixExtensions = 0;
    for (let i = 0; i < n - 2; i++) {
        const segment = current.substring(i, i + 5);
        if (notes.has(segment)) {
            if (i < 2 && prefixExtensions === 0) {
                prefixExtensions += 2 - i;
            }
            if ((i > n - 6) && suffixExtensions === 0) {
                suffixExtensions += i - (n - 6);
            } 

            const pot = notes.get(segment);
            next += pot;
        }
        else {
            next += '.';
        }
    }    
    const prefix = '.'.repeat(2 + prefixExtensions);
    const suffix = '.'.repeat(suffixExtensions);
    state.next = prefix + next + suffix;
    state.start -= prefixExtensions;
};

const processGenerations = (initialState, notes, generations = 1) => {
    const state = {
        start: -4,
        current: `....${initialState}....`
    };

//    console.log(state.current);

    for (let i = 0; i < generations; i++) {
        processGeneration(state, notes);
        state.current = state.next;
//        console.log(state.current);
    }

    return state;
}

const sumPots = ({ start, current }) => {
    const n = current.length;

    return current.split('').reduce((sum, pot, i) => sum + (pot === '#' ? i + start : 0), 0);
};

(async () => {
    const lines = await readFile('12-input.txt');

    const { initialState, notes } = parseInput(lines);
    
    const lastGeneration = processGenerations(initialState, notes, 50000000000);

    const potsSum = sumPots(lastGeneration);

    console.log(`The sum of the numbers of all pots is ${potsSum}`);
})();