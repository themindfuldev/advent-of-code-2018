const { readFile } = require('./reader');
const { buildTree } = require('./08-common');

const sumMetadata = root => {
    let total = 0;
    let queue = [root];
    while (queue.length > 0) {
        const node = queue.shift();
        total += node.metadataEntries.reduce((sum, entry) => sum + entry, 0);
        queue.push(...node.childNodes);
    }
    return total;
};

(async () => {
    const lines = await readFile('08-input.txt');

    const tree = buildTree(lines[0].split(' '));

    const sum = sumMetadata(tree);

    console.log(`The sum of all metadata entries is ${sum}`);
})();