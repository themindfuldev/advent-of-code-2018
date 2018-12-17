const getScoreBoard = input => {
    const scoreboard = [3, 7];
    let elf1 = 0;
    let elf2 = 1;

    while (scoreboard.length < input + 10) {
        const scoreElf1 = scoreboard[elf1];
        const scoreElf2 = scoreboard[elf2];
        const newRecipes = (scoreElf1 + scoreElf2).toString().split('').map(i => +i);
        scoreboard.push(...newRecipes);

        const { length } = scoreboard;
        elf1 = (elf1 + scoreElf1 + 1) % length;
        elf2 = (elf2 + scoreElf2 + 1) % length;
    }

    return scoreboard;
};

(() => {
    const input = 880751;
    const scoreboard = getScoreBoard(input);
    const scores = scoreboard.slice(input, input + 10).join('');

    console.log(`The scores of the ten recipes immediately after the given number of recipes is ${scores}`);
})();