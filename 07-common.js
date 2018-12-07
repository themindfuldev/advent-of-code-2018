class Step {
    constructor(letter) {
        this.letter = letter;
        this.dependents = [];
        this.dependencies = [];
    }    

    addDependent(dependent) {
        this.dependents.push(dependent);
        dependent.dependencies.push(this);
    }
}

const regex = /^Step\s(?<dependency>\w)\smust\sbe\sfinished\sbefore\sstep\s(?<dependent>\w)\scan\sbegin\.$/;

const getStep = (steps, id) => {
    let step;
    if (steps.has(id)) {
        step = steps.get(id);
    }
    else {
        step = new Step(id);
        steps.set(id, step);
    }
    return step;
}

const buildSteps = lines => {
    const steps = new Map();
    for (let line of lines) {
        const { dependency, dependent } = line.match(regex).groups;
        const dependencyStep = getStep(steps, dependency);
        const dependentStep = getStep(steps, dependent);
        dependencyStep.addDependent(dependentStep);
    }
    return steps;
};

const getFirstSteps = steps => {
    const firstSteps = [...steps.values()].filter(step => step.dependencies.length === 0);

    return sortSimilarSteps(firstSteps);        
};

const sortSimilarSteps = steps => {
    return steps.sort((a, b) => a.letter.charCodeAt(0) - b.letter.charCodeAt(0));
};

module.exports = {
    Step,
    getStep,
    buildSteps,
    getFirstSteps,
    sortSimilarSteps
};