const { readFile } = require('./reader');

const regex = /^position=<\s?(?<posX>-?\d+), \s?(?<posY>-?\d+)> velocity=<\s?(?<velX>-?\d+), \s?(?<velY>-?\d+)>$/;

const parseInput = lines => {
    return lines.map(line => {
        const { posX, posY, velX, velY } = line.match(regex).groups;
        return {
            posX: +posX,
            posY: +posY,
            velX: +velX,
            velY: +velY
        };
    });
};

const tick = (points, seconds = 1) => {
    for (let point of points) {
        point.posX += point.velX * seconds;
        point.posY += point.velY * seconds;
    }
};

const getEdges = points => {
    const posX = points.map(p => p.posX);
    const posY = points.map(p => p.posY);

    return {
        minX: Math.min(...posX),
        maxX: Math.max(...posX),
        minY: Math.min(...posY),
        maxY: Math.max(...posY)
    };
};

const printPoints = points => {
    const { minX, maxX, minY, maxY } = getEdges(points);
    const lengthX = maxX - minX + 1;
    const lengthY = maxY - minY + 1;

    const grid = Array.from({length: lengthY}, row => Array.from({length: lengthX}, col => '.'));

    for (let point of points) {
        const x = point.posX - minX;
        const y = point.posY - minY;
        grid[y][x] = '#';
    }

    for (let row of grid) {
        console.log(row.join(''));
    }
};

(async () => {
    const lines = await readFile('10-input.txt');

    const points = parseInput(lines);

    //for (let i=1; i<2; i++) {
        tick(points);
        printPoints(points);
    //}
})();