const { readFile } = require('./reader');

const {
    MAP,
    buildMap,
    openTheTap,
    countWater
} = require('./17-common');

(async () => {
    const lines = await readFile('17-input.txt');

    const { map, minY, maxY, minX, maxX } = buildMap(lines);    
    openTheTap(map, minY, maxY, minX, maxX);

    const squaresCount = countWater(map, minY, maxY, minX, maxX, [MAP.WATER_RESTING]);
    console.log(`The number of remaining resting water tiles is ${squaresCount}.`);
})();