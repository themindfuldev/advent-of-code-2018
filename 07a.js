const { readFile } = require('./reader');
const {
    Step,
    getStep,
    buildSteps,
    getFirstSteps,
    sortSimilarSteps
} = require('./07-common');

const getStepsOrder = steps => {    
    let stepsOrder = '';
    while (steps.length > 0) {
        const step = steps.shift();
        stepsOrder += step.letter;
        for (let dependent of step.dependents) {
            const index = dependent.dependencies.indexOf(step);
            dependent.dependencies.splice(index, 1);
            if (dependent.dependencies.length === 0) {
                steps.push(dependent);
            }
        }
        sortSimilarSteps(steps);
    }
    return stepsOrder;
};

(async () => {
    const lines = await readFile('07-input.txt');

    const steps = buildSteps(lines);
    const firstSteps = getFirstSteps(steps);
    const stepsOrder = getStepsOrder(firstSteps);

    console.log(`The steps order is ${stepsOrder}`);
})();