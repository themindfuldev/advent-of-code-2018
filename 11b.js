const {
    buildGrid,
    findPowerSquare
} = require('./11-common');

const findPowerSquareOfAnySize = grid => {
    let squarePower;
    let top = 0;
    let left = 0;
    let size = 0;

    const cache = new Map();
    for (let i = 1; i <= 300; i++) {
        const [x, y, power] = findPowerSquare(grid, i, cache);

        if (squarePower === undefined || power > squarePower) {
            top = x;
            left = y;
            size = i;
            squarePower = power;
        }
    }

    return [top, left, size, squarePower];
}

(() => {
    const serialNumber = 5719;
    const grid = buildGrid(serialNumber);    

    const [top, left, size, squarePower] = findPowerSquareOfAnySize(grid);
    
    console.log(`The X,Y,size is ${top},${left},${size} and total power is ${squarePower}`);
})();