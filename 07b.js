const { readFile } = require('./reader');
const {
    Step,
    getStep,
    buildSteps,
    getFirstSteps,
    sortSimilarSteps
} = require('./07-common');

const WARM_UP = 60;
const WORKERS = 15;

const getStepDuration = step => WARM_UP + step.letter.charCodeAt(0) - 64;

const getStepsTime = steps => {
    const workers = Array.from({ length: WORKERS }, w => new Object({ step: null }));

    let isThereWorkLeft = steps.length > 0;
    let stepsOrder = '';
    let totalSeconds = 0;
    while (isThereWorkLeft) {
        for (let worker of workers) {
            let step = worker.step;

            // If worker is done, go over dependents and get yourself a new step
            if (step && step.elapsedSeconds === getStepDuration(step)) {
                stepsOrder += step.letter;
                for (let dependent of step.dependents) {
                    const index = dependent.dependencies.indexOf(step);
                    dependent.dependencies.splice(index, 1);
                    if (dependent.dependencies.length === 0) {
                        steps.push(dependent);
                    }
                }
                sortSimilarSteps(steps);

                worker.step = null;
                step = null;
            }

            // Assigning new step
            if (!step) {
                step = steps.shift();
                if (!step) {
                    continue;
                }
                worker.step = step;
                step.worker = worker;
                step.elapsedSeconds = 0;
            }

            if (step.elapsedSeconds < getStepDuration(step)) {
                step.elapsedSeconds++;
            }
        }
        isThereWorkLeft = !!workers.find(w => !!w.step);
        if (isThereWorkLeft) {
            totalSeconds++;
        }
    }
    return { stepsOrder, totalSeconds };
};

(async () => {
    const lines = await readFile('07-input.txt');

    const steps = buildSteps(lines);
    const firstSteps = getFirstSteps(steps);
    const { totalSeconds } = getStepsTime(firstSteps);

    console.log(`The steps time is ${totalSeconds}`);
})();