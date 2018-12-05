const { readFile } = require('./reader');

const buildClaims = lines => {
    const claims = new Map();
    const regex = /^#(?<id>\d*)\s@\s(?<left>\d*),(?<top>\d*):\s(?<width>\d*)x(?<height>\d*)$/;
    for (let line of lines) {
        const { id, left, top, width, height } = line.match(regex).groups;
        claims.set(id, { 
            left: +left, 
            top: +top, 
            width: +width, 
            height: +height
        });
    }
    return claims;
};

const calculateOverlaps = claims => {
    const fabric = [];

    let overlaps = 0;

    for (let [id, claim] of claims.entries()) {
        const { left, top, width, height } = claim;
        const bottom = top + height;
        const right = left + width;
        for (let row = top; row < bottom; row++) {
            for (let col = left; col < right; col++) {
                if (!fabric[row]) {
                    fabric[row] = [];
                }
                if (!fabric[row][col]) {
                    fabric[row][col] = 0;
                }
                else if (fabric[row][col] === 1) {
                    overlaps++;
                }
                fabric[row][col]++;
            }
        }
    }

    return overlaps;
};

(async () => {
    const lines = await readFile('03-input.txt');

    const claims = buildClaims(lines);
    const overlaps = calculateOverlaps(claims);

    console.log(`Overlaps are ${overlaps} square inches`);
})();