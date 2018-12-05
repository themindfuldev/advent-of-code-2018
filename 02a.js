const { readFile } = require('./reader');

(async () => {
    const lines = await readFile('02-input.txt');

    let twoLettersCount = 0;
    let threeLettersCount = 0;
    for (let line of lines) {
        const frequencyMap = {};
        for (const char of line.split('')) {
            frequencyMap[char] = (frequencyMap[char] || 0) + 1;
        }
        const hasTwoLetters = Object.values(frequencyMap).some(frequency => frequency === 2);
        const hasThreeLetters = Object.values(frequencyMap).some(frequency => frequency === 3);

        twoLettersCount += +hasTwoLetters;
        threeLettersCount += +hasThreeLetters;
    };

    const checksum = twoLettersCount * threeLettersCount;
    console.log(`The checksum is ${checksum}`);
})();
