const { readFile } = require('./reader');
const {
    buildMap,
    buildPath
} = require('./13-common');

const getRemainingCart = carts => {
    while (carts.length > 1) {
        for (let cart of carts) {
            if (!cart.crashed) {
                cart.move();
                if (cart.crashed) {
                    cart.square.cart = null;
                }
            }
        }
        carts = carts.filter(cart => !cart.crashed);
    };

    return carts.find(cart => !cart.crashed);
};

(async () => {
    const lines = await readFile('13-input.txt');
    const map = buildMap(lines);
    const { squares, carts } = buildPath(map);
    const cart = getRemainingCart(carts);

    console.log(`The location of the last cart is ${cart.square.y},${cart.square.x}`);
})();