const { readFile } = require('./reader');

const {
    getTerms,
    calculateDistances
} = require('./20-common');

const findMaxDistance = distances => {
    return [...distances.values()].reduce((max, distance) => Math.max(max, distance), 0);
}

(async () => {
    const input = (await readFile('20-input.txt'))[0];
    const root = getTerms(input);
    const distances = new Map();
    calculateDistances(distances, root);
    const maxDistance = findMaxDistance(distances);

    console.log(`The largest number of doors you would be required to pass through to reach a room is ${maxDistance}`);
})();