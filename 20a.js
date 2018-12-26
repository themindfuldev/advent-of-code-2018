const { readFile } = require('./reader');

class Term {
    constructor() {
        this.path = [];
    }

    addChar(char) {
        this.path.push(char);
    }

    addBranch(branch) {
        this.path.push(branch);
    }
}

class Branch {
    
    constructor(parentBranch) {
        this.terms = [];
        this.addTerm();
        this.parentBranch = parentBranch;
    }

    addTerm() {
        this.currentTerm = new Term();
        this.terms.push(this.currentTerm);
    }

    addChar(char) {
        this.currentTerm.addChar(char);
    }

    addBranch(branch) {
        branch.currentTerm = null;
        this.currentTerm.addBranch(branch);
    }
}

const getTerms = (input) => {
    const chars = input.substring(1, input.length-1);

    let currentBranch = new Branch();
    for (const char of chars) {
        if (char === '(') {
            currentBranch = new Branch(currentBranch);
        }
        else if (char === '|') {
            currentBranch.addTerm();
        }
        else if (char === ')') {
            currentBranch.parentBranch.addBranch(currentBranch);
            currentBranch = currentBranch.parentBranch;
        }
        else {
            currentBranch.addChar(char);
        }
    }
    currentBranch.currentTerm = null;
    return currentBranch;
};

const getKey = ({i,j}) => `${i},${j}`;

const getAdjacent = (currentPath, i, j) => {
    if (currentPath === 'N') return { i: i-1, j };
    if (currentPath === 'W') return { i, j: j-1 };
    if (currentPath === 'E') return { i, j: j+1 };
    if (currentPath === 'S') return { i: i+1, j };
}

// Dijkstra DFS algorithm
const calculateDistances = (distances, branch, termIndex = 0, pathIndex = 0, distance = 0, i = 0, j = 0) => {
    while (termIndex < branch.terms.length) {
        const term = branch.terms[termIndex];

        let currentDistance = distance;
        let currentI = i;
        let currentJ = j;
        while (pathIndex < term.path.length) {
            const path = term.path[pathIndex];
            pathIndex++;
            if (path instanceof Branch) {
                calculateDistances(distances, path, 0, 0, currentDistance, currentI, currentJ);
            }
            else {
                const adjacent = getAdjacent(path, currentI, currentJ);
                currentI = adjacent.i;
                currentJ = adjacent.j;

                const key = getKey(adjacent);
                const adjacentDistance = distances.get(key);
                currentDistance++;
                if (adjacentDistance === undefined || currentDistance < adjacentDistance) {
                    distances.set(key, currentDistance);
                }
            }
        }
        pathIndex = 0;
        termIndex++;
    }
}


// const calculateDistances = root => {
//     const distances = new Map();

//     const stack = [{ branch: root, termIndex: 0, pathIndex: 0, distance: 0, i: 0, j: 0 }];
//     do {
//         let { branch, termIndex, pathIndex, distance, i, j } = stack.pop();
//         let isNewBranch = false;
//         while (!isNewBranch && termIndex < branch.terms.length) {
//             const term = branch.terms[termIndex];

//             let currentDistance = distance;
//             let currentI = i;
//             let currentJ = j;
//             while (pathIndex < term.path.length) {
//                 const path = term.path[pathIndex];
//                 pathIndex++;
//                 if (path instanceof Branch) {
//                     stack.push({ branch, termIndex, pathIndex, distance: currentDistance, i: currentI, j: currentJ });
//                     stack.push({ branch: path, termIndex: 0, pathIndex: 0, distance: currentDistance, i: currentI, j: currentJ });
//                     isNewBranch = true;
//                     break;
//                 }
//                 else {
//                     const adjacent = getAdjacent(path, currentI, currentJ);
//                     currentI = adjacent.i;
//                     currentJ = adjacent.j;

//                     const key = getKey(adjacent);
//                     const adjacentDistance = distances.get(key);
//                     currentDistance++;
//                     if (adjacentDistance === undefined || currentDistance < adjacentDistance) {
//                         distances.set(key, currentDistance);
//                     }
//                 }
//             }
//             if (isNewBranch) break;
//             pathIndex = 0;
//             termIndex++;
//         }
//     } while (stack.length > 0);

//     return distances;
// };

const findMaxDistance = distances => {
    return [...distances.values()].reduce((max, distance) => Math.max(max, distance), 0);
}

(async () => {
    const input = (await readFile('test.txt'))[0];
    const root = getTerms(input);
    const distances = new Map();
    calculateDistances(distances, root);
    const maxDistance = findMaxDistance(distances);

    console.log(`What is the largest number of doors you would be required to pass through to reach a room is ${maxDistance}`);
})();