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
}

(async () => {
    const lines = await readFile('test.txt');

    const samples = readSamples(lines);

    console.log(samples);
    
})();