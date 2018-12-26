const { readFile } = require('./reader');

const {
    getTerms,
    calculateDistances
} = require('./20-common');

const getRoomsWithMinDistance = (distances, minDistance) => {
    return [...distances.values()].filter(distance => distance >= minDistance).length;
};

(async () => {
    const input = (await readFile('20-input.txt'))[0];
    const root = getTerms(input);
    const distances = new Map();
    calculateDistances(distances, root);
    const roomsWithMinDistance = getRoomsWithMinDistance(distances, 1000);

    console.log(`The number of rooms which have a shortest path from your current location that pass through at least 1000 doors is ${roomsWithMinDistance}`);
})();