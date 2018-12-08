const { readFile } = require('./reader');
const {
    Node,
    buildNode,
    buildTree
} = require('./08-common');

const getNodeValue = node => {
    let value = 0;
    if (node.childNodesSize === 0) {
        value += node.metadataEntries.reduce((sum, entry) => sum + entry, 0);
    }
    else {
        for (let entry of node.metadataEntries) {
            const child = node.childNodes[entry-1];
            if (child) {
                value += getNodeValue(child);
            }
        }
    }
    return value;
}

const getRootNodeValue = root => {
    return getNodeValue(root);
};

(async () => {
    const lines = await readFile('08-input.txt');

    const tree = buildTree(lines[0].split(' '));

    const rootNodeValue = getRootNodeValue(tree);

    console.log(`The value of the root node is is ${rootNodeValue}`);
})();