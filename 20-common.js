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

// DFS sorta-Dijkstra algorithm
const calculateDistances = (distances, branch, distance = 0, i = 0, j = 0) => {
    let termIndex = 0;
    while (termIndex < branch.terms.length) {
        const term = branch.terms[termIndex];
        let pathIndex = 0;
        
        let currentDistance = distance;
        let currentI = i;
        let currentJ = j;
        while (pathIndex < term.path.length) {
            const path = term.path[pathIndex];
            if (path instanceof Branch) {
                calculateDistances(distances, path, currentDistance, currentI, currentJ);
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
            pathIndex++;
        }
        termIndex++;
    }
}

module.exports = {
    getTerms,
    calculateDistances
};