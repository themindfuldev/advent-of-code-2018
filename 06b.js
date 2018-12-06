const { readFile } = require('./reader');

const {
    Coordinate,
    buildCoordinates,
    getGridDimension,
    plotCoordinates,
    calculateManhattanDistance
} = require('./06-common');

const MAX_TOTAL_DISTANCE = 10000;

const plotLocations = (coordinates, grid) => {
    const n = grid.length;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            let location = grid[i][j];
            if (!grid[i][j]) {
                location = new Coordinate(i, j);
                grid[i][j] = location;
            }

            const totalDistance = coordinates.reduce((sum, coordinate) =>{
                return sum + calculateManhattanDistance(location, coordinate);
            }, 0);
            
            location.inSafeRegion = totalDistance < MAX_TOTAL_DISTANCE;
        }
    }
};

const getSafeRegionSize = grid => {
    const n = grid.length;
    let safeRegionSize = 0;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            const location = grid[i][j];
            safeRegionSize += +location.inSafeRegion;
        }
    }
    return safeRegionSize;
};

(async () => {
    const lines = await readFile('06-input.txt');

    const coordinates = buildCoordinates(lines);
    const grid = plotCoordinates(coordinates);
    plotLocations(coordinates, grid);
    const safeRegionSize = getSafeRegionSize(grid);

    console.log(`The safe region size is ${safeRegionSize}`);
})();