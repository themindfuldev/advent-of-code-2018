const { readFile } = require('./reader');
const fs = require('fs');

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

const printPointsUntilMinimum = points => {
    const viewSize = 100;

    let minimumY = getEdges(points).lengthY;
    let hasReachedMinimum = false;
    let secondsForMessage = 0;

    while (!hasReachedMinimum) {
        tick(points);   
        secondsForMessage++;     

        const { lengthY } = getEdges(points);
        if (lengthY < minimumY) {
            minimumY = lengthY;            
        }
        else {
            tick(points, false);
            console.log(`${lengthY} lines`);
            printPoints(points);

            hasReachedMinimum = true;            
        }
    }

    console.log(`The elves had to wait ${secondsForMessage-1} seconds`);
}

const tick = (points, forward = true) => {
    const sign = forward ? 1 : -1;
    for (let point of points) {
        point.posX += point.velX * sign;
        point.posY += point.velY * sign;
    }
};

const getEdges = points => {
    const posX = points.map(p => p.posX);
    const posY = points.map(p => p.posY);

    const minX = Math.min(...posX);
    const maxX = Math.max(...posX);
    const minY = Math.min(...posY);
    const maxY = Math.max(...posY);

    return {
        minX,
        minY,
        lengthX: maxX - minX + 1,
        lengthY: maxY - minY + 1
    };
};

const printPoints = points => {
    const { minX, minY, lengthX, lengthY } = getEdges(points);

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

    printPointsUntilMinimum(points);    
})();