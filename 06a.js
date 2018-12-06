const { readFile } = require('./reader');

const {
    Coordinate,
    buildCoordinates,
    getGridDimension,
    plotCoordinates,
    calculateManhattanDistance
} = require('./06-common');

const plotLocations = (coordinates, grid) => {
    const n = grid.length;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (!grid[i][j]) {
                const location = new Coordinate(i, j);
                grid[i][j] = location;

                let smallestDistance;
                let closestCoordinates;
                for (let coordinate of coordinates) {
                    const distance = calculateManhattanDistance(location, coordinate);

                    if (!closestCoordinates || distance < smallestDistance) {
                        smallestDistance = distance;
                        closestCoordinates = [coordinate];
                    }
                    else if (distance === smallestDistance) {
                        closestCoordinates.push(coordinate);
                    }
                }

                if (closestCoordinates.length === 1) {
                    location.closestCoordinate = closestCoordinates[0];
                }
            }
        }
    }
};

const getFiniteCoordinateIds = (coordinates, grid) => {
    const n = grid.length;
    const infiniteCoordinateIds = new Set();

    // Top and bottom edges
    for (let i = 0; i < n; i += n-1) {
        for (let j = 0; j < n; j++) {
            const closestCoordinate = grid[i][j].closestCoordinate;
            if (closestCoordinate) {
                infiniteCoordinateIds.add(closestCoordinate.id);
            }
        }
    }

    // Left and right edges
    for (let j = 0; j < n; j += n-1) {
        for (let i = 0; i < n; i++) {
            const closestCoordinate = grid[i][j].closestCoordinate;
            if (closestCoordinate) {
                infiniteCoordinateIds.add(closestCoordinate.id);
            }
        }
    }

    const finiteCoordinateIds = coordinates
        .filter(coordinate => !infiniteCoordinateIds.has(coordinate.id))
        .map(coordinate => coordinate.id);

    return new Set(finiteCoordinateIds);
};

const calculateCoordinateRegions = (finiteCoordinates, grid) => {
    const n = grid.length;
    const frequencyMap = new Map();
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            const closestCoordinate = grid[i][j].closestCoordinate;
            if (closestCoordinate && finiteCoordinates.has(closestCoordinate.id)) {
                const { id } = closestCoordinate;
                const frequency = frequencyMap.get(id) || 1;
                frequencyMap.set(id, frequency+1);
            }
        }
    }
    return frequencyMap;
};

(async () => {
    const lines = await readFile('06-input.txt');

    const coordinates = buildCoordinates(lines);
    const grid = plotCoordinates(coordinates);
    plotLocations(coordinates, grid);
    const finiteCoordinateIds = getFiniteCoordinateIds(coordinates, grid);
    const coordinateRegions = calculateCoordinateRegions(finiteCoordinateIds, grid);
    const largestRegion = Math.max(...coordinateRegions.values());

    console.log(`The largest region is ${largestRegion}`);
})();