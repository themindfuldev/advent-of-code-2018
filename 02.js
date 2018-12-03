const fs = require('fs');
const readline = require('readline');

function readLines(file, onLine) {
    const reader = readline.createInterface({
        input: fs.createReadStream(file),
        crlfDelay: Infinity
    });

    reader.on('line', onLine);

    return new Promise(resolve => reader.on('close', resolve));
}

(async function part1() {
    let twoLettersCount = 0;
    let threeLettersCount = 0;
    const onLine = line => {
        const frequencyMap = {};
        for (const char of line.split('')) {
            frequencyMap[char] = (frequencyMap[char] || 0) + 1;
        }
        const hasTwoLetters = Object.values(frequencyMap).some(frequency => frequency === 2);
        const hasThreeLetters = Object.values(frequencyMap).some(frequency => frequency === 3);

        twoLettersCount += +hasTwoLetters;
        threeLettersCount += +hasThreeLetters;
    };

    await readLines('02-input.txt', onLine);

    const checksum = twoLettersCount * threeLettersCount;
    console.log(`The checksum is ${checksum}`);
})();

function compare(string1, string2) {
    const length = string1.length;
    let differentChars = 0;
    let differIndex;
    for (let i = 0; i < length; i++) {
        if (string1.charAt(i) !== string2.charAt(i)) {
            differIndex = i;
            differentChars++;
        }
    }

    return {
        differByOneChar: differentChars === 1,
        differIndex
    };
}

(async function part2() {    
    const ids = [];
    const onLine = line => {
        ids.push(line);
    }
    await readLines('02-input.txt', onLine);
        
    const idsCount = ids.length;
    for (let i = 0; i < idsCount; i++) {
        const id = ids[i];
        for (let j = i+1; j < idsCount; j++) {
            const { differByOneChar, differIndex } = compare(id, ids[j]);
            if (differByOneChar) {
                const commonLetters = id.slice(0, differIndex) + id.slice(differIndex + 1);
                console.log(`The common letters are ${commonLetters}`);
                return;
            }
        }
    }

})();