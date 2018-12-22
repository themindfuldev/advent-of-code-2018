const { readFile } = require('./reader');

const xRegex = /^x=(?<x>\d+), y=(?<y1>\d+)..(?<y2>\d+)$/;
const yRegex = /^y=(?<y>\d+), x=(?<x1>\d+)..(?<x2>\d+)$/;

const MAP = {
    CLAY: '#',
    SAND: '.',
    SPRING: '+',
    WATER_DOWN: '|',
    WATER_RESTING: '~'
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

    flowDown(map, x, y) {
        this.down = new WaterFlow({x, y: y+1, up: this, parent: DIRECTIONS.UP});
        map[y+1][x] = MAP.WATER_DOWN;
        return this.down;
    }

    flowToTheLeft(map) {
        let hasReachedLeftClay = false;
        let { x, y } = this;
        let currentWaterFlow = this;
        let nextSquare = map[y][x-1];
        let nextSquareBelow = map[y+1][x-1];

        while (currentWaterFlow && nextSquare !== MAP.CLAY && nextSquareBelow !== MAP.SAND) {
            if (nextSquare === MAP.SAND) {
                currentWaterFlow.left = new WaterFlow({x: x-1, y, right: currentWaterFlow, parent: DIRECTIONS.RIGHT});
            }
            currentWaterFlow = currentWaterFlow.left;
            
            map[y][x-1] = MAP.WATER_DOWN;
            x--;
            nextSquare = map[y][x-1];
            nextSquareBelow = map[y+1][x-1];
        }
        if (nextSquare === MAP.CLAY) {
            hasReachedLeftClay = true;
        }
        else if (currentWaterFlow) {
            currentWaterFlow.left = new WaterFlow({x: x-1, y, right: currentWaterFlow, parent: DIRECTIONS.RIGHT});
            currentWaterFlow = currentWaterFlow.left;
            map[y][x-1] = MAP.WATER_DOWN;
        }

        return { hasReachedLeftClay, leftmostWaterFlow: currentWaterFlow };
    }

    flowToTheRight(map) {
        let hasReachedRightClay = false;
        let { x, y } = this;
        let currentWaterFlow = this;
        let nextSquare = map[y][x+1];
        let nextSquareBelow = map[y+1][x+1];

        while (currentWaterFlow && nextSquare !== MAP.CLAY && nextSquareBelow !== MAP.SAND) {
            if (nextSquare === MAP.SAND) {
                currentWaterFlow.right = new WaterFlow({x: x+1, y, left: currentWaterFlow, parent: DIRECTIONS.LEFT});
            }
            currentWaterFlow = currentWaterFlow.right;
            
            map[y][x+1] = MAP.WATER_DOWN;
            x++;
            nextSquare = map[y][x+1];
            nextSquareBelow = map[y+1][x+1]
        }
        if (nextSquare === MAP.CLAY) {
            hasReachedRightClay = true;
        }
        else if (currentWaterFlow) {            
            currentWaterFlow.right = new WaterFlow({x: x+1, y, left: currentWaterFlow, parent: DIRECTIONS.LEFT});
            currentWaterFlow = currentWaterFlow.right;
            map[y][x+1] = MAP.WATER_DOWN;
        }

        return { hasReachedRightClay, rightmostWaterFlow: currentWaterFlow };
    }

    markWaterResting(map, leftmostWaterFlow, rightmostWaterFlow) {
        let {x, y} = leftmostWaterFlow;
        let maxX = rightmostWaterFlow.x;
        for (let i = x; i <= maxX; i++) {
            map[y][i] = MAP.WATER_RESTING;
        }
    }

    findUpstream(leftmostWaterFlow) {
        let square = leftmostWaterFlow;
        while (square.right && square.parent !== DIRECTIONS.UP) {
            square = square.right;
        }

        return square[square.parent];
    }

    flow(map) {        
        const next = [];
        
        const { x, y, parent } = this;
        
        // If square below is empty, flow down
        if (map[y+1][x] === MAP.SAND) {
            next.push(this.flowDown(map, x, y));
        }
        // If it came from its parent, then flow to the sides
        else {
            // Flow to the left
            const { leftmostWaterFlow, hasReachedLeftClay } = this.flowToTheLeft(map);
            if (!hasReachedLeftClay) {
                next.push(leftmostWaterFlow);
            }

            // Flow to the right
            const { rightmostWaterFlow, hasReachedRightClay } = this.flowToTheRight(map);
            if (!hasReachedRightClay) {
                next.push(rightmostWaterFlow);
            }

            // If trapped on both sides, return up
            if (hasReachedLeftClay && hasReachedRightClay) {
                this.markWaterResting(map, leftmostWaterFlow, rightmostWaterFlow);
                const upstream = this.findUpstream(leftmostWaterFlow, rightmostWaterFlow);
                next.push(upstream);
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

    // Marking clay squares
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

    // Marking spring squares
    map[0] = [];
    map[0][500] = MAP.SPRING;

    // Marking sand squares
    for (let i = 0; i <= maxY+1; i++) {
        if (!map[i]) map[i] = [];
        for (let j = minX-1; j <= maxX+1; j++) {
            map[i][j] = map[i][j] || MAP.SAND;
        }
    }

    return { map, minY, maxY, minX, maxX };
};

const openTheTap = (map, minY, maxY) => {
    let hasOverflown = false;    
    let waterSquare = new WaterFlow({ x: 500, y: 0 });
    const waterFlow = [];
    do {
        const newFlow = waterSquare.flow(map);
        waterFlow.push(...newFlow);
        
        waterSquare = waterFlow.shift();
    } while (waterSquare && waterSquare.y <= maxY);
};

const countWater = (map, minY, maxY, minX, maxX) => {
    let squaresCount = 0;
    for (let i = minY; i <= maxY; i++) {
        if (map[i]) {
            for (let j = minX-1; j <= maxX+1; j++) {
                if ([MAP.WATER_DOWN, MAP.WATER_RESTING].includes(map[i][j])) {
                    squaresCount++;
                }
            }
        }
    }
    return squaresCount;
};

(async () => {
    const lines = await readFile('17-input.txt');

    const { map, minY, maxY, minX, maxX } = buildMap(lines);
    
    openTheTap(map, minY, maxY, minX, maxX);

    const squaresCount = countWater(map, minY, maxY, minX, maxX);

    console.log(map.slice(0, maxY+1).map(row => row.join('')).join('\n'));

    console.log(`The number of tiles the water can reach is ${squaresCount}.`);
})();