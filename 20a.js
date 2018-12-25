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
    return currentBranch;
};

(async () => {
    const input = (await readFile('test.txt'))[0];

    const root = getTerms(input).currentTerm;

    
})();