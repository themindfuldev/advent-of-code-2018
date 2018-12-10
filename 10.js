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

    let { lengthY } = getEdges(points);
    let minimumY = lengthY;
    let hasReachedMinimum = false;
    let secondsForMessage = 0;

    while (!hasReachedMinimum) {
        if (lengthY < viewSize) {
            console.log(`${lengthY} lines`);
            printPoints(points);
        }

        tick(points);   
        secondsForMessage++;     

        lengthY = getEdges(points).lengthY;
        if (lengthY < minimumY) {
            minimumY = lengthY;            
        }
        else {
            hasReachedMinimum = true;
        }
    }

    console.log(`The elves had to wait ${secondsForMessage-1} seconds`);
}

const tick = (points, seconds = 1) => {
    for (let point of points) {
        point.posX += point.velX * seconds;
        point.posY += point.velY * seconds;
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
        maxX,
        minY,
        maxY,
        lengthX: maxX - minX + 1,
        lengthY: maxY - minY + 1
    };
};

const printPoints = points => {
    const { minX, maxX, minY, maxY, lengthX, lengthY } = getEdges(points);

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