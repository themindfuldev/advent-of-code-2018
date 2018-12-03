const { readFile } = require('./readLines');

// Compares two strings to see if they differ by one char and which one 
const compare = (string1, string2) => {
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
};

// Compare each strings to every other string 
// and get the common letters in case the differByOneChar is true
const getCommonLetters = ids => {
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
};

(async () => {
    const lines = await readFile('02-input.txt');

    const commonLetters = getCommonLetters(lines);
    console.log(`The common letters are ${commonLetters}`);
})();