const { readFile } = require('./reader');

const {
    tick,
    printSolution
} = require('./18-common');

(async () => {
    let outskirts = (await readFile('18-input.txt')).map(row => row.split(''));

    for (let i = 0; i < 10; i++) {
        outskirts = tick(outskirts);
    }
    
    console.log(outskirts.map(row => row.join('')).join('\n'));

    printSolution(outskirts);
})();