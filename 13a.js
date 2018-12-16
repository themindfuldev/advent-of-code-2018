const { readFile } = require('./reader');
const {
    buildMap,
    buildPath
} = require('./13-common');

const getSquareCrash = carts => {
    while (true) {
        for (let cart of carts) {
            cart.move();
            if (cart.crashed) {
                return cart.square;
            }
        }
    };
};

(async () => {
    const lines = await readFile('13-input.txt');
    const map = buildMap(lines);
    const { squares, carts } = buildPath(map);
    const square = getSquareCrash(carts);

    console.log(`The location of the first crash is ${square.y},${square.x}`);
})();