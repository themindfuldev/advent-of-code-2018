const numberOfRecipes = input => {
    const scoreboard = [3, 7];
    let elf1 = 0;
    let elf2 = 1;

    input = input.split('').map(i => +i);
    const n = input.length;

    let number;
    let m = scoreboard.length;

    let t = 1000000;
    while (!number) {
        const scoreElf1 = scoreboard[elf1];
        const scoreElf2 = scoreboard[elf2];

        const newRecipes = (scoreElf1 + scoreElf2).toString().split('').map(i => +i);
        scoreboard.push(...newRecipes);
        m += newRecipes.length;

        const { length } = scoreboard;
        elf1 = (elf1 + scoreElf1 + 1) % length;
        elf2 = (elf2 + scoreElf2 + 1) % length;

        let hasNotFoundInput = false;
        for (let i = 1; !hasNotFoundInput && i <= n; i++) {
            if (scoreboard[m-i] !== input[n-i]) {
                hasNotFoundInput = true;
            }
        }

        if (hasNotFoundInput && newRecipes.length === 2) {
            hasNotFoundInput = false;
            for (let i = 1; !hasNotFoundInput && i <= n; i++) {
                if (scoreboard[m-i-1] !== input[n-i]) {
                    hasNotFoundInput = true;
                }
            }
        }

        if (!hasNotFoundInput) {
            number = m - n;
        } 
    }

    return number;
};

(() => {
    const input = '880751';
    const number = numberOfRecipes(input);

    console.log(`The number of recipes which appear on the scoreboard to the left of input is ${number}`);
})();