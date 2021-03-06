const { readFile } = require('./reader');

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
    constructor({x, y, parent, left, right, down, up, cache}) {
        this.x = x;
        this.y = y;
        this.parent = parent;
        this.left = left;
        this.right = right;
        this.down = down;
        this.up = up;
    }

    flow(map, cache) {        
        const next = [];        
        const { x, y, parent } = this;
        const squareBelow = map[y+1][x];

        // If square below is empty, flow down
        if (squareBelow === MAP.SAND) {
            next.push(this.flowDown(map, cache, x, y));
        }
        // If it came from its parent, then flow to the sides
        else if ([MAP.CLAY, MAP.WATER_RESTING].includes(squareBelow)) {
            // Flow to the left
            const { leftmostWaterFlow, newLeftmostWaterFlow, hasReachedLeftClay } = this.flowToTheLeft(map, cache);
            if (!hasReachedLeftClay && newLeftmostWaterFlow) {
                next.push(newLeftmostWaterFlow);
            }

            // Flow to the right
            const { rightmostWaterFlow, newRightmostWaterFlow, hasReachedRightClay } = this.flowToTheRight(map, cache);
            if (!hasReachedRightClay && newRightmostWaterFlow) {
                next.push(newRightmostWaterFlow);
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

    flowDown(map, cache, x, y) {
        this.down = newWaterFlow({x, y: y+1, up: this, parent: DIRECTIONS.UP}, cache);
        map[y+1][x] = MAP.WATER_DOWN;
        return this.down;
    }

    flowToTheLeft(map, cache) {
        let hasReachedLeftClay = false;
        let { x, y } = this;
        let currentWaterFlow = this;
        let newLeftmostWaterFlow;
        let nextSquare = map[y][x-1];
        let nextSquareBelow = map[y+1][x-1];

        while ([MAP.SAND, MAP.WATER_DOWN, MAP.WATER_RESTING].includes(nextSquare) && nextSquareBelow !== MAP.SAND) {
            if (nextSquare === MAP.SAND) {
                currentWaterFlow.left = newWaterFlow({x: x-1, y, right: currentWaterFlow, parent: DIRECTIONS.RIGHT}, cache);
                map[y][x-1] = MAP.WATER_DOWN;
            }
            else if (!currentWaterFlow.left) {
                currentWaterFlow.left = getWaterFlowBySquare(cache, {x: x-1, y});
                currentWaterFlow.left.right = currentWaterFlow;
            }
            currentWaterFlow = currentWaterFlow.left;
            
            x--;
            nextSquare = map[y][x-1];
            nextSquareBelow = map[y+1][x-1];
        }
        if (nextSquare === MAP.CLAY) {
            hasReachedLeftClay = true;
        }
        else if (map[y+1][x] === MAP.WATER_DOWN) {
            do {
                currentWaterFlow = currentWaterFlow.down;
                y++;
            } while (map[y+1][x] === MAP.WATER_DOWN);
            newLeftmostWaterFlow = currentWaterFlow;
        }
        else if (nextSquareBelow === MAP.SAND) {
            newLeftmostWaterFlow = currentWaterFlow.left = newWaterFlow({x: x-1, y, right: currentWaterFlow, parent: DIRECTIONS.RIGHT}, cache);
            map[y][x-1] = MAP.WATER_DOWN;
        }

        return { hasReachedLeftClay, leftmostWaterFlow: currentWaterFlow, newLeftmostWaterFlow };
    }

    flowToTheRight(map, cache) {
        let hasReachedRightClay = false;
        let { x, y } = this;
        let currentWaterFlow = this;
        let newRightmostWaterFlow;
        let nextSquare = map[y][x+1];
        let nextSquareBelow = map[y+1][x+1];

        while ([MAP.SAND, MAP.WATER_DOWN, MAP.WATER_RESTING].includes(nextSquare) && nextSquareBelow !== MAP.SAND) {
            if (nextSquare === MAP.SAND) {
                currentWaterFlow.right = newWaterFlow({x: x+1, y, left: currentWaterFlow, parent: DIRECTIONS.LEFT}, cache);
                map[y][x+1] = MAP.WATER_DOWN;
            }
            else if (!currentWaterFlow.right){
                currentWaterFlow.right = getWaterFlowBySquare(cache, {x: x+1, y});
                currentWaterFlow.right.left = currentWaterFlow;
            }
            currentWaterFlow = currentWaterFlow.right;
            
            x++;
            nextSquare = map[y][x+1];
            nextSquareBelow = map[y+1][x+1]
        }
        if (nextSquare === MAP.CLAY) {
            hasReachedRightClay = true;
        }
        else if (map[y+1][x] === MAP.WATER_DOWN) {
            do {
                currentWaterFlow = currentWaterFlow.down;
                y++;
            } while (map[y+1][x] === MAP.WATER_DOWN);
            newRightmostWaterFlow = currentWaterFlow;
        }
        else if (nextSquareBelow === MAP.SAND) {
            newRightmostWaterFlow = currentWaterFlow.right = newWaterFlow({x: x+1, y, left: currentWaterFlow, parent: DIRECTIONS.LEFT}, cache);
            map[y][x+1] = MAP.WATER_DOWN;
        }

        return { hasReachedRightClay, rightmostWaterFlow: currentWaterFlow, newRightmostWaterFlow };
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

}

const buildMap = lines => {
    const xRegex = /^x=(?<x>\d+), y=(?<y1>\d+)..(?<y2>\d+)$/;
    const yRegex = /^y=(?<y>\d+), x=(?<x1>\d+)..(?<x2>\d+)$/;

    const map = [];

    let minY = Number.POSITIVE_INFINITY; 
    let maxY = -1;
    let minX = Number.POSITIVE_INFINITY; 
    let maxX = -1;

    // Marking clay squares
    for (const line of lines) {
        let match = line.match(xRegex);
        if (match) {
            let { x, y1, y2 } = match.groups;
            x = +x;
            y1 = +y1;
            y2 = +y2;

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
                let { y, x1, x2 } = match.groups;
                y = +y;
                x1 = +x1;
                x2 = +x2;
                
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
    minX--;
    maxX++;

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

const getKey = ({x, y}) => `${x},${y}`;

const getWaterFlowBySquare = (cache, square) => cache.get(getKey(square));

const setWaterFlowBySquare = (cache, waterFlow) => cache.set(getKey(waterFlow), waterFlow);

const newWaterFlow = (args, cache) => {
    const waterFlow = new WaterFlow(args);
    setWaterFlowBySquare(cache, waterFlow);
    return waterFlow;
};

const openTheTap = (map, minY, maxY) => {
    let hasOverflown = false;    
    const cache = new Map();
    const waterFlow = [new WaterFlow({ x: 500, y: 0 })];    
    do {
        const waterSquare = waterFlow.shift();
        const newFlow = waterSquare.flow(map, cache);
        waterFlow.push(...newFlow.filter(flow => flow.y <= maxY));
    } while (waterFlow.length > 0);
};

const countWater = (map, minY, maxY, minX, maxX, types = [MAP.WATER_DOWN, MAP.WATER_RESTING]) => {
    let squaresCount = 0;
    for (let i = minY; i <= maxY; i++) {
        for (let j = minX; j <= maxX; j++) {
            if (types.includes(map[i][j])) {
                squaresCount++;
            }
        }
    }
    return squaresCount;
};

module.exports = {
    MAP,
    buildMap,
    openTheTap,
    countWater
};