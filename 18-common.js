const MAP = {
    OPEN_GROUND: '.',
    TREES: '|',
    LUMBERYARD: '#'
};

const tick = originalMap => {
    const n = originalMap.length;
    const nextMap = Array.from({length: n}, row => Array.from({length: n}));

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            const originalAcre = originalMap[i][j];
            const adjacents = getAdjacents(originalMap, i, j, n);

            // For an open ground acre
            if (originalAcre === MAP.OPEN_GROUND) {
                const adjacentTrees = adjacents.filter(acre => acre === MAP.TREES).length;
                nextMap[i][j] = adjacentTrees >= 3 ? MAP.TREES : MAP.OPEN_GROUND;
            }
            // For a trees acre
            else if (originalAcre === MAP.TREES) {
                const adjacentLumberyards = adjacents.filter(acre => acre === MAP.LUMBERYARD).length;
                nextMap[i][j] = adjacentLumberyards >= 3 ? MAP.LUMBERYARD : MAP.TREES;
            }
            // For a lumberyard acre
            else if (originalAcre === MAP.LUMBERYARD) {
                const adjacentLumberyards = adjacents.filter(acre => acre === MAP.LUMBERYARD).length;
                const adjacentTrees = adjacents.filter(acre => acre === MAP.TREES).length;
                nextMap[i][j] = adjacentLumberyards >= 1 && adjacentTrees >= 1 ? MAP.LUMBERYARD : MAP.OPEN_GROUND;
            }
        }
    }

    return nextMap;
};

const getAdjacents = (originalMap, i, j, n) => {
    const positions = [[i-1, j-1], [i-1, j], [i-1, j+1], [i, j-1], [i, j+1], [i+1, j-1], [i+1, j], [i+1, j+1]];

    return positions
        .filter(([i, j]) => i >= 0 && j >= 0 && i < n && j < n)
        .map(([i, j]) => originalMap[i][j])
        .filter(acre => acre !== undefined);
};

const count = (map, type) => {
    return map.reduce((total, row) => total += row.reduce((subtotal, col) => subtotal + (col === type ? 1 : 0), 0), 0);
};

module.exports = {
    MAP,
    tick,
    count
};
