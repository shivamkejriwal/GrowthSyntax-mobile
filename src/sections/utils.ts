
const getDirection = (e) => {
    const directionMap = {
        1: 'none', 
        2: 'left',
        4: 'right',
        8: 'up',
        16: 'down',
        6: 'horizontal',
        24: 'vertical',
        30: 'all'
    }

    return directionMap[e.direction];
}

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
    return (list && list.length > 0) ? list[list.length - 1] : {};
};

const getSecondLastObject = (list) => {
    return (list && list.length > 1) ? list[list.length - 2] : {};
};

const round = (value, precision) => {
    const multiplier = Math.pow(10, precision);
    return Math.round(value * multiplier) / multiplier;
}

const divide = (a,b) => round(a/b, 2);

const average = (array) => {
    if (array.length < 1) {
        return array[0] ? array[0] : 0;
    }
    return round(array.reduce((a, b) => a + b) / array.length, 2)
};

const median = (array) => {
    array.sort((a, b) => a - b);
    const lowMiddle = Math.floor((array.length - 1) / 2);
    const highMiddle = Math.ceil((array.length - 1) / 2);
    const median = (array[lowMiddle] + array[highMiddle]) / 2;
    return median;
}

const standardDeviation = (array: Array<any>) => {
    const avg = average(array);

    const squareDiffs = array.map((value) => {
        var diff = value - avg;
        var sqrDiff = diff * diff;
        return sqrDiff;
    });

    const avgSquareDiff = average(squareDiffs);

    const stdDev = Math.sqrt(avgSquareDiff);
    return stdDev;
}

const isMonotone = (array) => {
    return array.every((ele, i, list) => { 
        if (i) return ele > list[i-1]; 
        else return true; 
    });
}

const monotoneCheck = (array) => {
    let count = 0;
    array.forEach((ele, i, list) => { 
        if(i && ele > list[i-1]) {
            count++;
        }
        if(!i && ele){
            count ++;
        }
    });
    return count;
}

const change = (array:Array<number>, isRelative) => {
    const change = [];
    array.forEach((ele, i, arr) => {
        if (i){
            const prev = arr[i-1];
            const absDiff = Math.abs(ele - prev);
            const relativeDiff = divide(absDiff, prev) * 100;
            const value = isRelative ? relativeDiff : absDiff;
            change.push(value);
        }
    });
    return change;
}

const cleanSeries = (array: Array<any>) => {
    const series = [];
    let total = 0;
    array.forEach((ele,i) => {
        total = total + ele; 
        if (total) {
            series.push(ele);
        }
    });
    return series;
}

const volatility = (array: Array<any>) => {
    const std = Utils.standardDeviation(array) || 0;
    const ave = Utils.average(array) || 1;
    const volatility = Math.abs(std-ave)/ave;
    console.log('buildVolatility', {
        array,
        std, 
        ave,
        volatility
    });
    return volatility;
}

const weightedAverage = (array, rawWeights) => {
    const total = rawWeights.reduce((sum, value) => sum + value);
    const weights = rawWeights.map(x => x/total);
    const weightedValues = combinedOperation(array, weights, (a,b)=> a*b);
    console.log('div-weightedAverage',{array, weights,total, weightedValues});
    return weightedValues.reduce((sum, value) => sum + value);
    
}

const Utils = {
    getDirection,
    reduce,
    getLastObject,
    getSecondLastObject,
    round,
    divide,
    weightedAverage,
    average,
    median,
    isMonotone,
    monotoneCheck,
    change,
    volatility,
    standardDeviation,
    combinedOperation,
    cleanSeries
};

export { Utils };
