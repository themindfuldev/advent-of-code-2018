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

// Compares two strings to see if they differ by one char and which one 
function compare(string1, string2) {
    const length = string1.length;
    let differentChars = 0;
    let differIndex;
    for (let i = 0; i < length; i++) {
        if (string1.charAt(i) !== string2.charAt(i)) {
            differentChars++;            
            differIndex = differentChars === 1 ? i : undefined;
        }
    }

    return {
        differByOneChar: differentChars === 1,
        differIndex
    };
}

// Compare each strings to every other string 
// and get the common letters in case the differByOneChar is true
function getCommonLetters(ids) {
    const idsCount = ids.length;
    for (let i = 0; i < idsCount; i++) {
        const id = ids[i];
        for (let j = i + 1; j < idsCount; j++) {
            const { differByOneChar, differIndex } = compare(id, ids[j]);
            if (differByOneChar) {
                return id.slice(0, differIndex) + id.slice(differIndex + 1);
            }
        }
    }
}

(async function part2() {
    // Reading each line an adding into the ids array
    const ids = [];
    const onLine = line => {
        ids.push(line);
    }
    await readLines('02-input.txt', onLine);    

    const commonLetters = getCommonLetters(ids);
    console.log(`The common letters are ${commonLetters}`);

})();