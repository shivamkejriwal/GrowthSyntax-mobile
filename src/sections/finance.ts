import { Utils } from './utils';

// Present Value (PV)
const PV = (ratePercent, cf1, numOfPeriod) => {
  numOfPeriod = typeof numOfPeriod !== 'undefined' ? numOfPeriod : 1;
  var rate = ratePercent/100, pv;
  pv = cf1 / Math.pow((1 + rate),numOfPeriod);
  return Utils.round(pv,2);
};

// Future Value (FV)
const FV = (ratePercent, cf0, numOfPeriod) => {
  var rate = ratePercent/100, fv;
  fv = cf0 * Math.pow((1 + rate), numOfPeriod);
  return Utils.round(fv, 2);
};

// Terminal Value (TV)
const TV = (longTermRatePercent, discountRatePercent, finalCF) => {
  const longTermRate = longTermRatePercent/100;
  const discountRate = discountRatePercent/100;
  return Math.round(finalCF * (1 + longTermRate) / (discountRate - longTermRate)) ;
};

const Forcast = (rate, value, time) => {
    let results = [];
    for(let period = 0; period<=time ;period++) {
        results.push(FV(rate, value, period));
    }
    return results;
};

// seekZero seeks the zero point of the function fn(x), accurate to within x \pm 0.01. fn(x) must be decreasing with x.
const seekZero = (fn) => {
  var x = 1;
  while (fn(x) > 0) {
    x += 1;
  }
  while (fn(x) < 0) {
    x -= 0.01
  }
  return x + 0.01;
};

// Internal Rate of Return (IRR)
const IRR = (cfs) => {
  var args = cfs;
  var numberOfTries = 1;
  // Cash flow values must contain at least one positive value and one negative value
  var positive, negative;
  Array.prototype.slice.call(args).forEach(function (value) {
    if (value > 0) positive = true;
    if (value < 0) negative = true;
  })
  if (!positive || !negative) throw new Error('IRR requires at least one positive value and one negative value');
  function npv(rate) {
    numberOfTries++;
    if (numberOfTries > 1000) {
      throw new Error('IRR can\'t find a result');
    }
    var rrate = (1 + rate/100);
    var npv = args[0];
    for (var i = 1; i < args.length; i++) {
      npv += (args[i] / Math.pow(rrate, i));
    }
    return npv;
  }
  return Utils.round(seekZero(npv), 2);
};

// Compound Annual Growth Rate (CAGR)
const CAGR = (beginningValue, endingValue, numOfPeriods) => {
  var CAGR = Math.pow((endingValue / beginningValue), 1 / numOfPeriods) - 1;
  return Math.round(CAGR * 10000) / 100;
};


const growthRates = (list) => {
    let rates = [];
    const last = list.length - 1;
    for(let period = 1; period < list.length; period++) {
        for (let time = 0; time < last; time=time+period) {
            const endIndex = ((time+period) > last ) ? last : time+period;
            const begin = list[time];
            const end = list[endIndex];
            const periods = endIndex - time;
            const growth = CAGR(begin, end, period);
            rates.push(growth);
        }
    }
    return rates;
};

const evaluteCurrentCashFlow = (fundamentals) => {
    const list = fundamentals;
    const currentData = Utils.getLastObject(list);
    const prevData = Utils.getSecondLastObject(list);
    const currentWorkingCapital = currentData.ASSETSC - currentData.LIABILITIESC;
    const previousWorkingCapital = prevData.ASSETSC - prevData.LIABILITIESC;
    const currentValue = currentWorkingCapital
                - previousWorkingCapital
                + Math.abs(currentData.CAPEX)
                + currentData.NETINC;
    return currentValue;
}


const forcastedCashFromRevenue = (fundamentals, timeFrame, estimatedGrowthRate) => {
    const list = fundamentals;
    const revenueOverTime = Utils.reduce(list, 'REVENUE', (val) => val);
    const fcfOverTime = Utils.reduce(list, 'FCF', (val) => val);
    const ratios = Utils.combinedOperation(fcfOverTime, revenueOverTime, (a,b) => Utils.divide(a,b));
    const averageRatio = Utils.average(ratios);


    const revenueGrowthRates = Finance.growthRates(revenueOverTime);
    const revenueGrowth = Utils.average(revenueGrowthRates);
    const growthRate = (estimatedGrowthRate) ? estimatedGrowthRate : revenueGrowth;

    const forcastedRevenue = Forcast(growthRate, Utils.getLastObject(revenueOverTime), timeFrame);
    const forcastedFCF = forcastedRevenue.map(x => x * averageRatio);
    console.log('forcastedCashFromRevenue', {
        revenueGrowthRates,
        revenueGrowth,
        growthRate,
        ratios,
        averageRatio,
        forcastedRevenue,
        forcastedFCF
    });
    return forcastedFCF;
};

const forcastedCashFromDividend = (fundamentals, timeFrame, estimatedGrowthRate) => {
    const list = fundamentals;
    const dividendPerShareOverTime = Utils.reduce(list, 'DPS', (val) => val);
    const sharesOverTime = Utils.reduce(list, 'SHARESWA', (val) => val);
    const dividendOverTime = Utils.combinedOperation(dividendPerShareOverTime, sharesOverTime, (a,b) => a * b);

    const fcfOverTime = Utils.reduce(list, 'FCF', (val) => val);
    const ratios = Utils.combinedOperation(fcfOverTime, dividendOverTime, (a,b) => Utils.divide(a,b));
    const averageRatio = Utils.average(ratios);


    const dividendGrowthRates = Finance.growthRates(dividendOverTime);
    const dividendGrowth = Utils.average(dividendGrowthRates);
    const growthRate = (estimatedGrowthRate) ? estimatedGrowthRate : dividendGrowth;

    const forcastedDividend = Forcast(growthRate, Utils.getLastObject(dividendOverTime), timeFrame);
    const forcastedFCF = forcastedDividend.map(x => x * averageRatio);
    console.log('forcastedCashFromDividend', {
        estimatedGrowthRate,
        dividendGrowthRates,
        dividendGrowth,
        growthRate,
        ratios,
        averageRatio,
        forcastedDividend,
        forcastedFCF
    });
    return forcastedFCF;
};

const evaluateFutureCashFlow = (profile, fundamentals, estimatedGrowthRate, timeFrame) => {
    const list = fundamentals;
    const sector = profile.sector;
    // const sector = 'Financial';

    const currentValue = evaluteCurrentCashFlow(fundamentals);

    const futureCashFlow = (sector !== 'Financial') ?
                            forcastedCashFromRevenue(fundamentals, timeFrame, estimatedGrowthRate)
                            : forcastedCashFromDividend(fundamentals, timeFrame, estimatedGrowthRate);
    futureCashFlow[0] = Number.isNaN(currentValue) ? futureCashFlow[0] : currentValue;
    return futureCashFlow;
}

const getPresentValue = (discountRate, futureCashFlow, timeFrame) => {
    let values = []
    for (let year = 1; year <= timeFrame; year++) {
        const futureValue = futureCashFlow[year];
        const presentValue = PV(discountRate, futureValue, year);
        values.push(presentValue);
    }
    const total = values.reduce((sum, value) => sum + value, 1);
    return {
        total,
        values
    };
}

const getFairValue = (fundamentals, presentValues, presentTerminalValue) => {
    const list = fundamentals;
    const currentData = Utils.getLastObject(list);
    const sharesOutstanding = currentData.SHARESWA;
    const obligations = currentData.LIABILITIESNC || 0;
    const cash = Math.abs(currentData.NCFF)
                + Math.abs(currentData.NCFI)
                + Math.abs(currentData.NCFO);

    const equityValue = presentValues.total
                        + presentTerminalValue
                        - obligations;
    const fairValue = Utils.round(equityValue / sharesOutstanding, 2);
    console.log('getFairValue', {
        fairValue,
        cash,
        obligations,
        equityValue
    });
    return fairValue;
}

const evaluateDCF = (profile, fundamentals, timeFrame, discountRate, riskFreeRate, estimatedGrowthRate) => {

    const futureCashFlow = evaluateFutureCashFlow(profile, fundamentals, estimatedGrowthRate, timeFrame);
    const presentValues = getPresentValue(discountRate, futureCashFlow, timeFrame);

    const terminalValue = TV(riskFreeRate, discountRate, futureCashFlow[timeFrame]);
    const presentTerminalValue = PV(discountRate, terminalValue, timeFrame);

    const fairValue = getFairValue(fundamentals, presentValues, presentTerminalValue);

    console.log('DCF', {
        discountRate,
        presentValues,
        futureCashFlow,
        terminalValue,
        presentTerminalValue,
        fairValue
    });
    return fairValue
};



// Instantiate a Finance class
const Finance =  {
    IRR,
    CAGR,
    FV,
    PV,
    TV,
    evaluateDCF,
    growthRates,
    Forcast
};

export default Finance;
