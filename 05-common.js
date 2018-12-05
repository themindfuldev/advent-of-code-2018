const reactPolymer = polymer => {
    let stack = [];
    for (let char of polymer.split('')) {
        const top = stack[stack.length - 1];
        if (top && top.toLowerCase() === char.toLowerCase() && top !== char) {
            stack.pop();
        }
        else {
            stack.push(char);
        }
    }

    return stack;
}

module.exports = {
    reactPolymer
};