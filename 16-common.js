const beforeRegex = /^Before: \[(?<b0>\d), (?<b1>\d), (?<b2>\d), (?<b3>\d)\]$/;
const instructionRegex = /^(?<op>\d+) (?<a>\d) (?<b>\d) (?<c>\d)$/;
const afterRegex = /^After:  \[(?<a0>\d), (?<a1>\d), (?<a2>\d), (?<a3>\d)\]$/;

const readInput = lines => {
    const samples = [];
    const program = [];
    const n = lines.length;
    for (let i = 0; i < n; i++) {
        const line = lines[i];
        const sampleMatch = line.match(beforeRegex);
        if (sampleMatch) {
            const { b0, b1, b2, b3 } = sampleMatch.groups;
            const { op, a, b, c } = lines[i+1].match(instructionRegex).groups;
            const { a0, a1, a2, a3 } = lines[i+2].match(afterRegex).groups;
            samples.push({
                before: [+b0, +b1, +b2, +b3],
                instructions: [+op, +a, +b, +c],
                after: [+a0, +a1, +a2, +a3]
            });
            i += 2;
        }
        else {
            const programMatch = line.match(instructionRegex);
            if (programMatch) {
                const { op, a, b, c } = programMatch.groups;
                program.push([+op, +a, +b, +c]);
            }
        }

    }
    return { samples, program };
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

module.exports = {
    readInput,
    operations
};