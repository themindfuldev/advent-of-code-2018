const { readFile } = require('./reader');

const {
    MAP,
    tick,
    count
} = require('./18-common');

(async () => {
    let outskirts = await readFile('18-input.txt');

    for (let i = 0; i < 10; i++) {
        outskirts = tick(outskirts);
    }
    
    console.log(outskirts.map(row => row.join('')).join('\n'));

    const trees = count(outskirts, MAP.TREES);
    const lumberyards = count(outskirts, MAP.LUMBERYARD);

    console.log(`The total resource value of the lumber collection area is ${trees * lumberyards}`);

})();