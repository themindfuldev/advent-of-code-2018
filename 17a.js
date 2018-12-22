const { readFile } = require('./reader');

const xRegex = /^x=(?<x>\d+), y=(?<y1>\d+)..(?<y2>\d+)$/;
const yRegex = /^y=(?<y>\d+), x=(?<x1>\d+)..(?<x2>\d+)$/;

const MAP = {
    CLAY: '#',
    SAND: '.',
    SPRING: '+',
    WATER: '|'
};

const DIRECTIONS = {
    LEFT: 'left',
    RIGHT: 'right',
    DOWN: 'down',
    UP: 'up'
};

class WaterFlow {
    constructor({x, y, parent, left, right, down, up}) {
        this.x = x;
        this.y = y;
        this.parent = parent;
        this.left = left;
        this.right = right;
        this.down = down;
        this.up = up;
    }

    flow(map) {
        const { x, y, parent } = this;

        const next = [];

        // If square below is empty, flow down
        if (!map[y+1] || map[y+1][x] === undefined) {
            this.down = new WaterFlow({x, y: y+1, up: this, parent: DIRECTIONS.UP});
            if (!map[y+1]) map[y+1] = [];
            map[y+1][x] = MAP.WATER;
            next.push(this.down);
        }
        // If it came from up, then flow to the sides
        else if (parent === DIRECTIONS.UP) {
            if (map[y][x-1] === undefined) {
                this.left = new WaterFlow({x: x-1, y, right: this, parent: DIRECTIONS.RIGHT});
                map[y][x-1] = MAP.WATER;
                next.push(this.left);
            }
            else {
                this.returnedFromLeft = true;
            }

            if (map[y][x+1] === undefined) {
                this.right = new WaterFlow({x: x+1, y, left: this, parent: DIRECTIONS.LEFT});
                map[y][x+1] = MAP.WATER;
                next.push(this.right);
            }
            else {
                this.returnedFromRight = true;
            }
        }
        // If it came from right, keep going left
        else if (parent === DIRECTIONS.RIGHT) {
            // If square to the left is empty, flow left
            if (map[y][x-1] === undefined) {
                this.left = new WaterFlow({x: x-1, y, right: this, parent: DIRECTIONS.RIGHT});
                map[y][x-1] = MAP.WATER;
                next.push(this.left);
            }
            // If square to the left is clay, go back until up
            else {
                let square = this;
                while (square.parent !== DIRECTIONS.UP) {
                    square = square[square.parent];
                }

                square.returnedFromLeft = true;
                
                if (square.returnedFromRight && !square.returnedUp) {
                    square.returnedUp = true;
                    next.push(square[square.parent]);
                }
            }
        }
        // If it came from left, keep going right
        else if (parent === DIRECTIONS.LEFT) {
            // If square to the right is empty, flow right
            if (map[y][x+1] === undefined) {
                this.right = new WaterFlow({x: x+1, y, right: this, parent: DIRECTIONS.LEFT});
                map[y][x+1] = MAP.WATER;
                next.push(this.right);
            }
            // If square to the right is clay, go back until up
            else {
                let square = this;
                while (square.parent !== DIRECTIONS.UP) {
                    square = square[square.parent];
                } 

                square.returnedFromRight = true;
                if (square.returnedFromLeft && !square.returnedUp) {
                    square.returnedUp = true;
                    next.push(square[square.parent]);
                }
            }
        }

        return next;
    }
}

const buildMap = lines => {
    const map = [];
    let minY = Number.POSITIVE_INFINITY; 
    let maxY = -1;
    let minX = Number.POSITIVE_INFINITY; 
    let maxX = -1;

    for (const line of lines) {
        let match = line.match(xRegex);
        if (match) {
            const { x, y1, y2 } = match.groups;            

            for (let i = y1; i <= y2; i++) {
                if (!map[i]) map[i] = [];
                map[i][x] = MAP.CLAY;
            }

            minY = Math.min(minY, y1);
            maxY = Math.max(maxY, y2);
            minX = Math.min(minX, x);
            maxX = Math.max(maxX, x);
        }
        else {
            match = line.match(yRegex);
            if (match) {
                const { y, x1, x2 } = match.groups;
                
                if (!map[y]) map[y] = [];

                for (let i = x1; i <= x2; i++) {
                    map[y][i] = MAP.CLAY;
                
                }
                minY = Math.min(minY, y);
                maxY = Math.max(maxY, y);
                minX = Math.min(minX, x1);
                maxX = Math.max(maxX, x2);
            }
        }
    }

    return { map, minY, maxY, minX, maxX };
};

const openTheTap = (map, minY, maxY) => {
    map[0] = [];
    map[0][500] = MAP.SPRING;

    let hasOverflown = false;    
    let waterSquare = new WaterFlow({ x: 500, y: 0 });
    const waterFlow = [];
    do {
        const newFlow = waterSquare.flow(map);
        waterFlow.push(...newFlow);
        
        waterSquare = waterFlow.shift();
    } while (waterSquare && waterSquare.y >= minY && waterSquare.y <= maxY);
};

const countWater = (map, minY, maxY, minX, maxX) => {
    let squaresCount = 0;
    for (let i = minY; i <= maxY; i++) {
        if (map[i]) {
            for (let j = minX-1; j <= maxX+1; j++) {
                if (map[i][j] === MAP.WATER) {
                    squaresCount++;
                }
            }
        }
    }
    return squaresCount;
};

const fillWithSand = (map, minY, maxY, minX, maxX) => {
    for (let i = 0; i <= maxY; i++) {
        if (!map[i]) map[i] = [];
        for (let j = minX-1; j <= maxX+1; j++) {
            map[i][j] = map[i][j] || MAP.SAND;
        }
    }
};

(async () => {
    const lines = await readFile('test.txt');

    const { map, minY, maxY, minX, maxX } = buildMap(lines);

    openTheTap(map, minY, maxY, minX, maxX);

    const squaresCount = countWater(map, minY, maxY, minX, maxX);

    fillWithSand(map, minY, maxY, minX, maxX);

    console.log(map.slice(0, maxY+1).map(row => row.join('')).join('\n'));

    console.log(`The number of tiles the water can reach is ${squaresCount}.`);
})();