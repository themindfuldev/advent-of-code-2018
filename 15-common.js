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
const INITIAL_AP = 3;

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
                ap: INITIAL_AP,
                isAlive: true
            }
        }
    }
}

const readDungeon = lines => {
    const n = lines.length;

    const dungeon = Array.from({ length: n }, row => []);
    
    const units = [];
    for (let i = 0; i < n; i++) {
        let m = lines[i].indexOf(' ');
        m = m === -1 ? lines[i].length : m;
        for (let j = 0; j < m; j++) {
            const square = dungeon[i][j] = new Square({x: i, y: j, type: lines[i][j]});
            if (square.unit) {
                units.push(square.unit);
            }
        }
    }

    return { dungeon, units };
};

const getAdjacents = (dungeon, square, type) => {
    const n = dungeon.length;
    const m = dungeon[0].length;

    const { x, y } = square;
    const adjacents = [];
    if (x > 0) adjacents.push(dungeon[x-1][y]);
    if (y > 0) adjacents.push(dungeon[x][y-1]);
    if (y < m - 1) adjacents.push(dungeon[x][y+1]);
    if (x < n - 1) adjacents.push(dungeon[x+1][y]);

    return type ? adjacents.filter(square => square.type === type) : adjacents;
}

const getKey = ({ x, y }) => `${x},${y}`;

const getMinimumDistance = (dungeon, start, end) => {
    const unvisitedSquares = new Set();
    const distances = new Map();
    const getDistance = square => distances.get(getKey(square));

    // Setting initial infinite distances
    const n = dungeon.length;
    const m = dungeon[0].length;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < m; j++) {
            const square = dungeon[i][j];
            if (square.type === MAP.CAVERN) {
                distances.set(getKey(square), Number.POSITIVE_INFINITY);
                unvisitedSquares.add(square);
            }
        }
    }
    
    distances.set(getKey(start), 0);
    
    let current = start;
    while (current) {
        const nextDistance = getDistance(current) + 1;
        getAdjacents(dungeon, current, MAP.CAVERN)
            .filter(square => unvisitedSquares.has(square))
            .forEach(square => distances.set(getKey(square), Math.min(getDistance(square), nextDistance)));

        unvisitedSquares.delete(current);
        
        current = unvisitedSquares.size > 0 ?
            [...unvisitedSquares].reduce((minimum, square) => getDistance(minimum) <= getDistance(square) ? minimum : square) :
            undefined;
    }

    const endDistance = Math.min(...getAdjacents(dungeon, end, MAP.CAVERN).map(getDistance));

    return { endDistance, getDistance };
};

const getNext = (dungeon, unit, nearest) => {
    const { endDistance, getDistance } = getMinimumDistance(dungeon, nearest, unit);
    return getAdjacents(dungeon, unit, MAP.CAVERN).find(square => getDistance(square) === endDistance);
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
    const allReachables = [];  
    for (let enemy of enemies) {
        const adjacents = getAdjacents(dungeon, enemy.square, MAP.CAVERN);
        const inRange = adjacents.map(square => {
            return {
                square,
                distance: getMinimumDistance(dungeon, square, unit.square).endDistance
            };
        });
        const reachables = inRange.filter(adjacent => adjacent.distance < Number.POSITIVE_INFINITY);
        allReachables.push(...reachables);
    }

    if (allReachables.length > 0) {
        const nearest = allReachables.reduce((nearest, square) => nearest.distance <= square.distance ? nearest : square);
        const next = getNext(dungeon, unit.square, nearest.square);

        step(unit, next);
    }
}

const attack = (unit, enemiesInRange) => {
    const minHp = enemiesInRange.reduce((min, enemy) => Math.min(min, enemy.hp), MAX_HP);
    const weakestEnemy = enemiesInRange.filter(({hp}) => hp === minHp)[0];

    weakestEnemy.hp -= unit.ap;

    if (weakestEnemy.hp <= 0) {
        weakestEnemy.isAlive = false;
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

    let hasCombatEndedEarly = false;
    for (let unit of units) {
        if (unit.isAlive) {
            // If no enemies, combat ends early
            const hasEnemies = units.some(enemy => enemy.type === unit.enemyOf && enemy.isAlive);
            if (hasEnemies) {
                // Determine action
                let adjacents = getAdjacents(dungeon, unit.square);
                let enemiesInRange = getEnemiesInRange(adjacents, unit);

                if (enemiesInRange.length === 0) {
                    // Moves and attacks
                    const openCaverns = adjacents.filter(square => square.type === MAP.CAVERN);
                    const enemies = units.filter(nextUnit => unit.enemyOf === nextUnit.type && nextUnit.isAlive);
                    if (openCaverns.length > 0 && enemies.length > 0) {
                        // Moves
                        move(unit, units, enemies, openCaverns, dungeon);
                        
                        // Attacks
                        adjacents = getAdjacents(dungeon, unit.square);
                        enemiesInRange = getEnemiesInRange(adjacents, unit);
                        if (enemiesInRange.length > 0) {
                            attack(unit, enemiesInRange);
                        }
                    }
                }
                else {
                    // Attacks
                    attack(unit, enemiesInRange);
                }
            }
            else {
                hasCombatEndedEarly = true;
            }
        }
    }
    
    // Removes dead
    while (units.some(unit => !unit.isAlive)) {
        const nextDead = units.find(unit => !unit.isAlive);
        units.splice(units.indexOf(nextDead), 1);
    }

    sort(units);

    return hasCombatEndedEarly;
};

const getOutcome = (rounds, units) => {
    const remainingHp = units.reduce((total, unit) => total += unit.hp, 0);
    return rounds * remainingHp;
};

const getGoblins = units => units.filter(unit => unit.type === MAP.GOBLIN);
const getElves = units => units.filter(unit => unit.type === MAP.ELF);

const printStats = (rounds, dungeon, units) => {
    console.log(`round ${rounds}:`);
    console.log(dungeon.map(row => row.map(col => col.type).join('')).join('\n'));
    console.log(units.map(u => `${u.type}(${u.id}): ${u.hp}`));        
}

module.exports = {
    readDungeon,
    makeRound,
    getGoblins,
    getElves,
    printStats,
    getOutcome  
};