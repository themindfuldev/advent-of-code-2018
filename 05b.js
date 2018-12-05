const { readFile } = require('./reader');
const { reactPolymer } = require('./05-common');

const detectUnitTypes = polymer => {
    const existence = new Set();
    return polymer.toLowerCase().split('').filter(unit => {
        if (existence.has(unit)) {
            return false;
        }
        existence.add(unit);
        return true;
    });
};

(async () => {
    const lines = await readFile('05-input.txt');

    const unitTypes = detectUnitTypes(lines[0]);

    const polymersWithoutUnit = new Map();
    for (let unit of unitTypes) {
        const polymer = reactPolymer(lines[0].replace(new RegExp(unit, 'ig'), ''));
        polymersWithoutUnit.set(unit, polymer.length);
    }

    const shortestPolymerLength = Math.min(...polymersWithoutUnit.values());

    console.log(`The remaining units are ${shortestPolymerLength}`);
})();