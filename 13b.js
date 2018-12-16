const { readFile } = require('./reader');
const {
    buildMap,
    buildPath
} = require('./13-common');

const getRemainingCart = carts => {
    let tick = 0;
    while (carts.length > 1) {
        carts.sort((a, b) => {
            const sA = a.square;
            const sB = b.square;
            return (sA.x === sB.x) ? sA.y - sB.y : sA.x - sB.x;
          });
        for (let cart of carts) {
            if (!cart.crashed) {
                cart.move();
                if (cart.crashed) {
                    cart.square.cart = null;
                }
            }
        }
        carts = carts.filter(cart => !cart.crashed);
        tick++
    };

    return carts[0];
};

(async () => {
    const lines = await readFile('13-input.txt');
    const map = buildMap(lines);
    const { squares, carts } = buildPath(map);
    const cart = getRemainingCart(carts);

    console.log(`The location of the last cart ${cart.id} is ${cart.square.y},${cart.square.x}`);
})();