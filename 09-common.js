class Node {
    constructor(value) {
        this.value = value;
        this.right = this;
        this.left = this;
    }

    addToRight(neighbor) {
        if (this.right) {
            this.right.left = neighbor;
        }
        neighbor.right = this.right;
        neighbor.left = this;
        this.right = neighbor;
    }

    visitLeft(times = 1) {
        let node = this;
        for (let i = 0; i < times; i++) {
            node = node.left
        }
        return node;
    }

    remove() {
        const left = this.left;
        const right = this.right;
        left.right = right;
        right.left = left;
        this.right = null;
        this.left = null;
    }
}

const parseInput = input => {
    const inputRegex = /^(?<players>\d+) players; last marble is worth (?<marbles>\d+) points$/;
    const { players, marbles } = input.match(inputRegex).groups;
    return { players: +players, marbles : +marbles};
};

const getPlayerScores = (players, marbles) => {
    const playerScores = Array.from({ length: players }, p => 0);
    
    let currentMarble = new Node(0);
    for (let i = 1; i <= marbles; i++) {
        const newMarble = new Node(i);
        
        if (i % 23 > 0) {
            currentMarble.right.addToRight(newMarble);
            currentMarble = newMarble;
        }
        else {
            const currentPlayer = i % players;
            const marbleToBeRemoved = currentMarble.visitLeft(7);
            playerScores[currentPlayer] += i + marbleToBeRemoved.value;
            currentMarble = marbleToBeRemoved.right;
            marbleToBeRemoved.remove(); 
        }
    }

    return playerScores;
}

module.exports = {
    parseInput,
    getPlayerScores
};