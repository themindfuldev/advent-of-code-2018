const { readFile } = require('./reader');

const {
    buildMap,
    openTheTap,
    countWater
} = require('./17-common');

(async () => {
    const lines = await readFile('17-input.txt');

    const { map, minY, maxY, minX, maxX } = buildMap(lines);    
    openTheTap(map, minY, maxY, minX, maxX);

    console.log(`{ minX: ${minX}, maxX: ${maxX}, minY: ${minY}, maxY: ${maxY} }`);
    console.log(map.slice(0, maxY+1).map((row, i) => `${i.toString().padStart(4)}:${row.join('')}`).join('\n'));

    const squaresCount = countWater(map, minY, maxY, minX, maxX);
    console.log(`The number of tiles the water can reach is ${squaresCount}.`);
})();