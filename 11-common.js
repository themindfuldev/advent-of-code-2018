const buildCell = (x, y, serialNumber) => {
    const rackId = x + 10;
    const powerLevel = ( rackId * y + serialNumber ) * rackId;
    const digit = Math.trunc(powerLevel % 1000 / 100) - 5; 
    return digit;
};

const buildGrid = serialNumber => {
    const grid = Array.from({length:301}, row => Array.from({length:301}));

    for (let i = 1; i <= 300; i++) {
        for (let j = 1; j <= 300; j++) {
            grid[i][j] = buildCell(i, j, serialNumber);
        }
    }

    return grid;
};

const findPowerSquare = (grid, squareSize, cache = new Map()) => {
    let squarePower;
    let top = 0;
    let left = 0;

    for (let i = 1; i <= 300 - squareSize; i++) {
        for (let j = 1; j <= 300 - squareSize; j++) {
            let power = 0;

            const previousKey = `${i},${j},${squareSize-1}`;
            const currentKey = `${i},${j},${squareSize}`;
            if (cache.has(previousKey)) {
                power = cache.get(previousKey);
                for (let k = i; k < i + squareSize - 1; k++) {
                    power += grid[k][j + squareSize - 1];
                }
                for (let k = j; k < j + squareSize; k++) {
                    power += grid[i + squareSize - 1][k];
                }
                cache.set(currentKey, power);
            }
            else {
                for (let k = i; k < i + squareSize; k++) {
                    for (let l = j; l < j + squareSize; l++) {
                        power += grid[k][l];
                    }
                }
                cache.set(currentKey, power);
            }
            if (squarePower === undefined || power > squarePower) {
                top = i;
                left = j;
                squarePower = power;
            }
        }
    }

    return [top, left, squarePower];
};

module.exports = {
    buildGrid,
    findPowerSquare
};