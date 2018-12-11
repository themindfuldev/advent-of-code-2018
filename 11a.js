const {
    buildGrid,
    findPowerSquare
} = require('./11-common');

(() => {
    const serialNumber = 5719;
    const grid = buildGrid(serialNumber);
    const [top, left, squarePower] = findPowerSquare(grid, 3);
    
    console.log(`The X,Y coordinate is ${top},${left} and total power is ${squarePower}`);
})();