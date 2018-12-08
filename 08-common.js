class Node {
    constructor(childNodesSize, metadataEntriesSize) {
        this.childNodesSize = +childNodesSize;
        this.metadataEntriesSize = +metadataEntriesSize;
        this.childNodes = [];
        this.metadataEntries = [];
    }
}

const buildNode = (input, i = 0) => {
    const node = new Node(input[i], input[i + 1]);
    i += 2;

    for (let j = 0; j < node.childNodesSize; j++) {
        let [children, newI] = buildNode(input, i);
        i = newI;
        node.childNodes.push(children);
    }    

    node.metadataEntries.push(...input.slice(i, i + node.metadataEntriesSize).map(entry => +entry));
    i += node.metadataEntriesSize;
    return [node, i];
};

const buildTree = input => {
    const [root, i] = buildNode(input);
    return root;
};

module.exports = {
    Node,
    buildNode,
    buildTree
};