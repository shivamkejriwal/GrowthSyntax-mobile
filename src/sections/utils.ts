
const reduce = (list, key, alter) => {
    if (!list) return [];
    return list.reduce((prev, next) => {
        const val = alter(next[key]);
        let old = (prev instanceof Array) ? prev : [alter(prev[key])];
        let result = [val];
        return old.concat(result);
    });
};

const combinedOperation = (eleA, eleB, op) => {
    let res = [];
    for(let i=0; i < eleA.length; i++) {
        res.push(op(eleA[i],eleB[i]));
    };
    return res;
}

const getLastObject = (list) => {
    return (list.length > 0) ? list[list.length - 1] : {};
};

const round = (value, precision) => {
    const multiplier = Math.pow(10, precision);
    return Math.round(value * multiplier) / multiplier;
}

const divide = (a,b) => round(a/b, 2);

const average = (array) => round(array.reduce((a, b) => a + b) / array.length, 2);

const median = (array) => {
    array.sort((a, b) => a - b);
    const lowMiddle = Math.floor((array.length - 1) / 2);
    const highMiddle = Math.ceil((array.length - 1) / 2);
    const median = (array[lowMiddle] + array[highMiddle]) / 2;
    return median;
}
const Utils = {
    reduce,
    getLastObject,
    round,
    divide,
    average,
    median,
    combinedOperation
};

export { Utils };
