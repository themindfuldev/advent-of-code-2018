class Coordinate {
    constructor(x, y, id) {
        this.x = x;
        this.y = y;
        this.id = id;
    }
}

const buildCoordinates = lines => {
    return lines.map((line, index) => {
        const [x, y] = line.split(', ');
        return new Coordinate(+x, +y, index);
    });
};

const getGridDimension = coordinates => {
    let largestX = 0;
    let largestY = 0;
    for (let coordinate of coordinates) {
        const { x, y } = coordinate;
        largestX = Math.max(largestX, x);
        largestY = Math.max(largestY, y);
    }
    return Math.max(largestX, largestY) + 1;
}

const plotCoordinates = coordinates => {
    const n = getGridDimension(coordinates);

    const grid = Array.from({ length: n }, row => Array.from({ length: n }));
    for (let coordinate of coordinates) {
        const { x, y } = coordinate;
        grid[x][y] = coordinate;
    }
    return grid;
};

const calculateManhattanDistance = (c1, c2) => {
    return Math.abs(c1.x - c2.x) + Math.abs(c1.y - c2.y);
};

module.exports = {
    Coordinate,
    buildCoordinates,
    getGridDimension,
    plotCoordinates,
    calculateManhattanDistance
};