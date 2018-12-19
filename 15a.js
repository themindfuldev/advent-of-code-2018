const { readFile } = require('./reader');

const MAP = {
    WALL: '#',
    CAVERN: '.',
    GOBLIN: 'G',
    ELF: 'E'
};

const ENEMIES = {
    [MAP.GOBLIN]: MAP.ELF,
    [MAP.ELF]: MAP.GOBLIN
}

const MAX_HP = 200;
const AP = 3;

let generator = 0;
class Square {
    constructor({x, y, type}) {
        this.x = x;
        this.y = y;
        this.type = type;
        
        if ([MAP.GOBLIN, MAP.ELF].includes(type)) {
            this.unit = {
                id: generator++,
                type,
                square: this,
                enemyOf: ENEMIES[type],
                hp: MAX_HP,
                alive: true
            }
        }
    }
}

const readDungeon = lines => {
    const n = lines.length;

    const dungeon = Array.from({ length: n }, row => []);
    
    const units = [];
    for (let i = 0; i < n; i++) {
        const m = lines[i].indexOf(' ') || lines[i].length;
        for (let j = 0; j < m; j++) {
            const square = dungeon[i][j] = new Square({x: i, y: j, type: lines[i][j]});
            if (square.unit) {
                units.push(square.unit);
            }
        }
    }

    return { dungeon, units };
};

const getAdjacents = (dungeon, square) => {
    const n = dungeon.length;
    const m = dungeon[0].length;

    const { x, y } = square;
    const adjacents = [];
    if (x > 0) adjacents.push(dungeon[x-1][y]);
    if (y > 0) adjacents.push(dungeon[x][y-1]);
    if (y < m - 1) adjacents.push(dungeon[x][y+1]);
    if (x < n - 1) adjacents.push(dungeon[x+1][y]);

    return adjacents;
}

const getKey = ({ x, y }) => `${x},${y}`;

const getMinimumPath = (target, unit, dungeon) => {
    const path = [target];
    const visitedSquares = new Set();
    visitedSquares.add(getKey(target));

    const { x, y } = unit.square;
    const unitAdjacents = getAdjacents(dungeon, unit.square).filter(adjacent => adjacent.type === MAP.CAVERN);
    
    let i = target.x;
    let j = target.y;
    while (!unitAdjacents.includes(target)) {
        const targetAdjacents = getAdjacents(dungeon, target);

        const availablePositions = 
            targetAdjacents
                .filter(adjacent => adjacent.type === MAP.CAVERN && !visitedSquares.has(getKey(adjacent)))
                .map(getKey);
        const availables = new Set(availablePositions);
        const isAvailable = (x, y) => availables.has(getKey({x, y}));
        
        let hasMoved = true;
        if (i > x && isAvailable(i-1, j)) i--;
        else if (j > y && isAvailable(i, j-1)) j--;
        else if (j < y && isAvailable(i, j+1)) j++;
        else if (i < x && isAvailable(i+1, j)) i++;
        else if (availablePositions.length > 0) {
            const [ greedyX, greedyY] = availablePositions[0].split(',');
            i = +greedyX;
            j = +greedyY;
        } 
        else hasMoved = false;
        
        if (hasMoved) {
            target = dungeon[i][j];
            path.push(target);
            visitedSquares.add(getKey(target));
        }
        else {
            target = path.pop();
            if (!target) return [];
        }
    }

    return path;
};

const step = (unit, nearest) => {
    const oldSquare = unit.square;
    delete oldSquare.unit;
    oldSquare.type = MAP.CAVERN;

    nearest.unit = unit;
    nearest.type = unit.type;
    unit.square = nearest;
};

const move = (unit, units, enemies, openCaverns, dungeon) => {  
    const nearests = [];  
    for (let enemy of enemies) {
        const adjacents = getAdjacents(dungeon, enemy.square).filter(square => square.type === MAP.CAVERN);
        const reachables = adjacents
            .map(adjacent => {
                const path = getMinimumPath(adjacent, unit, dungeon);
                return {
                    square: adjacent,
                    path,
                    distance: path.length
                };
            })
            .filter(adjacent => adjacent.distance > 0);

        if (reachables.length > 0) {
            const nearest = reachables.reduce((nearest, adjacent) => nearest.distance <= adjacent.distance ? nearest : adjacent);

            nearests.push(nearest);
        }
    }

    if (nearests.length > 0) {
        const nearest = nearests.reduce((nearest, adjacent) => nearest.distance <= adjacent.distance ? nearest : adjacent);
        const nextStep = nearest.path[nearest.path.length-1];

        step(unit, nextStep);
    }
}

const attack = enemiesInRange => {
    const minHp = enemiesInRange.reduce((min, enemy) => Math.min(min, enemy.hp), MAX_HP);
    const weakestEnemy = enemiesInRange.filter(({hp}) => hp === minHp)[0];

    weakestEnemy.hp -= AP;

    if (weakestEnemy.hp <= 0) {
        weakestEnemy.alive = false;
        weakestEnemy.square.type = MAP.CAVERN;
        delete weakestEnemy.square.unit;
        delete weakestEnemy.square;
    }    
}

const getEnemiesInRange = (adjacents, { enemyOf }) => {
    return adjacents
        .filter(square => square.type === enemyOf && square.unit)
        .map(square => square.unit);
};

const sort = units => {
    units.sort((a, b) => {
        const sA = a.square;
        const sB = b.square;
        return (sA.x === sB.x) ? sA.y - sB.y : sA.x - sB.x;
    });
};

const makeRound = (dungeon, units) => {
    const n = dungeon.length;
    const m = dungeon[0].length;

    for (let unit of units) {
        // Determine action
        if (unit.alive) {
            let adjacents = getAdjacents(dungeon, unit.square);
            let enemiesInRange = getEnemiesInRange(adjacents, unit);

            if (enemiesInRange.length === 0) {
                // Moves and attacks
                const openCaverns = adjacents.filter(square => square.type === MAP.CAVERN);
                const enemies = units.filter(nextUnit => unit.enemyOf === nextUnit.type && nextUnit.alive);
                if (openCaverns.length > 0 && enemies.length > 0) {
                    // Moves
                    move(unit, units, enemies, openCaverns, dungeon);
                    
                    // Attacks
                    adjacents = getAdjacents(dungeon, unit.square);
                    enemiesInRange = getEnemiesInRange(adjacents, unit);
                    if (enemiesInRange.length > 0) {
                        attack(enemiesInRange);
                    }
                }
            }
            else {
                // Attacks
                attack(enemiesInRange);
            }
        }        
    }
    
    while (units.some(unit => !unit.alive)) {
        const nextDead = units.find(unit => !unit.alive);
        units.splice(units.indexOf(nextDead), 1);
    }

    sort(units);
};

(async () => {
    const lines = await readFile('test.txt');

    const { dungeon, units } = readDungeon(lines);

    let goblins, elves;
    let rounds = 0;
    do {
        rounds++;
        makeRound(dungeon, units);
        goblins = units.filter(unit => unit.type === MAP.GOBLIN).length;
        elves = units.filter(unit => unit.type === MAP.ELF).length;
        console.log(`round ${rounds}:`);
        console.log(dungeon.map(row => row.map(col => col.type).join('')).join('\n'));
        console.log(units.map(u => `${u.type}(${u.id}): ${u.hp}`));
    } while (goblins > 0 && elves > 0);

    const remainingHp = units.reduce((total, unit) => total += unit.hp, 0);
    const outcome = rounds * remainingHp;

    console.log(`The ${goblins > 0 ? 'goblins': 'elves'} won!`);
    console.log(`The outcome of the combat is ${outcome}`);
})();