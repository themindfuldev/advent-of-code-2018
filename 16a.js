const { readFile } = require('./reader');

const beforeRegex = /^Before: \[(?<b0>\d), (?<b1>\d), (?<b2>\d), (?<b3>\d)\]$/;
const instructionRegex = /^(?<op>\d+) (?<a>\d) (?<b>\d) (?<c>\d)$/;
const afterRegex = /^After:  \[(?<a0>\d), (?<a1>\d), (?<a2>\d), (?<a3>\d)\]$/;

const readSamples = lines => {
    const samples = [];
    const n = lines.length;
    for (let i = 0; i < n; i++) {
        const line = lines[i];
        const match = line.match(beforeRegex);
        if (match) {
            const { b0, b1, b2, b3 } = match.groups;
            const { op, a, b, c } = lines[i+1].match(instructionRegex).groups;
            const { a0, a1, a2, a3 } = lines[i+2].match(afterRegex).groups;
            samples.push({
                before: [+b0, +b1, +b2, +b3],
                instructions: [+op, +a, +b, +c],
                after: [+a0, +a1, +a2, +a3]
            });
            i += 2;
        }
    }
    return samples;
};

const operations = {
    'addr': ([op, a, b, c]) => registers => { 
        const result = [...registers];
        result[c] = registers[a] + registers[b]; 
        return result; 
    },
    'addi': ([op, a, b, c]) => registers => { 
        const result = [...registers];
        result[c] = registers[a] + b; 
        return result; 
    },
    'mulr': ([op, a, b, c]) => registers => { 
        const result = [...registers];
        result[c] = registers[a] * registers[b]; 
        return result; 
    },
    'muli': ([op, a, b, c]) => registers => { 
        const result = [...registers];
        result[c] = registers[a] * b; 
        return result; 
    },
    'banr': ([op, a, b, c]) => registers => { 
        const result = [...registers];
        result[c] = registers[a] & registers[b]; 
        return result; 
    },
    'bani': ([op, a, b, c]) => registers => { 
        const result = [...registers];
        result[c] = registers[a] & b; 
        return result; 
    },
    'borr': ([op, a, b, c]) => registers => { 
        const result = [...registers];
        result[c] = registers[a] | registers[b]; 
        return result; 
    },
    'bori': ([op, a, b, c]) => registers => { 
        const result = [...registers];
        result[c] = registers[a] | b; 
        return result; 
    },
    'setr': ([op, a, b, c]) => registers => { 
        const result = [...registers];
        result[c] = registers[a]; 
        return result; 
    },
    'seti': ([op, a, b, c]) => registers => { 
        const result = [...registers];
        result[c] = a; 
        return result; 
    },
    'gtir': ([op, a, b, c]) => registers => { 
        const result = [...registers];
        result[c] = a > registers[b] ? 1 : 0; 
        return result; 
    },
    'gtri': ([op, a, b, c]) => registers => { 
        const result = [...registers];
        result[c] = registers[a] > b ? 1 : 0; 
        return result; 
    },
    'gtrr': ([op, a, b, c]) => registers => { 
        const result = [...registers];
        result[c] = registers[a] > registers[b] ? 1 : 0; 
        return result; 
    },
    'eqir': ([op, a, b, c]) => registers => { 
        const result = [...registers];
        result[c] = a === registers[b] ? 1 : 0; 
        return result; 
    },
    'eqri': ([op, a, b, c]) => registers => { 
        const result = [...registers];
        result[c] = registers[a] === b ? 1 : 0; 
        return result; 
    },
    'eqrr': ([op, a, b, c]) => registers => { 
        const result = [...registers];
        result[c] = registers[a] === registers[b] ? 1 : 0;
        return result;
     }
};

const evaluateSamples = samples => {
    let numberOfSamples = 0;

    for (let sample of samples) {
        const { before, instructions, after } = sample;

        const opcodes = Object.values(operations)
            .map(op => op(instructions)(before))
            .filter(result => result.toString() === after.toString()).length;

        if (opcodes >= 3) numberOfSamples += 1;
    }
    return numberOfSamples;
};

(async () => {
    const lines = await readFile('16-input.txt');

    const samples = readSamples(lines);
    const numberOfSamples = evaluateSamples(samples);

    console.log(`The number of samples with three or more opcodes is ${numberOfSamples}`);    
})();