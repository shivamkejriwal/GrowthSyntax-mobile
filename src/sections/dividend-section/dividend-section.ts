import { Component } from '@angular/core';
import { Events } from 'ionic-angular';
import Chart from 'chart.js';
import { Utils } from '../utils';


@Component({
  selector: 'dividend-section',
  templateUrl: 'dividend-section.html'
})
export class DividendSection {
  company:any;
  analysis: any = {};
  currentData: any = {};
  charts: Array<any> = [];
  ticker: string = '';

  constructor(public events: Events) {
    this.reset();
    this.events.subscribe('company', this.loadData);
    this.events.subscribe('company:reset', this.reset);
  }

  private loadData = (data) => {
    console.log('DividendSection-loadData', data);
    this.company = data;
    const dataComplete = Boolean(data.profile.ticker
                          && data.prices.ticker
                          && data.fundamentals.length > 0);
    const tickerMismatch = Boolean(this.ticker !== data.profile.ticker);
    if(dataComplete && tickerMismatch) {
      console.log('DividendSection-dataComplete', data);
      const list = this.company.fundamentals || [];
      this.currentData = Utils.getLastObject(list);
      this.buildDpsChart();
      this.buildAnalysis();
    }
  }

  buildAnalysis() {
    const list = this.company.fundamentals;
    const inverse = (val) => ((1/val) > 1) ? 1 : 1/val;
    // const FCF = Utils.reduce(list, 'FCF',(val) => val);
    const dps = Utils.reduce(list, 'DPS',(val) => val);
    const retainedEarnings = Utils.reduce(list, 'RETEARN',(val) => val);
    const cleanDps = Utils.cleanSeries(dps);
    const change = Utils.change(cleanDps, true);
    const years = dps.length;

    // const changeInFCF = FCF[years-1] - FCF[years-2];
    const cashFromOperations = this.currentData.NCFO;
    const dividendPaid = Math.abs(this.currentData.NCFDIV);
    const currentRatio = (this.currentData.CURRENTRATIO > 1) ? 1 : this.currentData.CURRENTRATIO;
    const cfoToDividend = inverse(cashFromOperations/dividendPaid);
    const debtToEquity = inverse(this.currentData.DE);
    const acceptablePayoutRatio = inverse(this.currentData.PAYOUTRATIO);          
    const dividendIncreases = Utils.monotoneCheck(dps);
    const retainedEarningsIncreases = Utils.monotoneCheck(retainedEarnings)/years;
    const volatility = Utils.volatility(change);

    const safetyList = [acceptablePayoutRatio, currentRatio, cfoToDividend, debtToEquity, retainedEarningsIncreases];
    const safety = Utils.weightedAverage(safetyList, [3, 3, 2, 2, 1]);
    // this.analysis.safety = Utils.average(safetyList);
    const dividendHistory = cleanDps.length/years;
    const increasingDividends = dividendIncreases/years;
    const stability = ((1 - volatility) < 0) ? 0 : 1 - volatility;

    const score = Utils.average([
        safety,
        stability,
        increasingDividends,
        dividendHistory
    ]);
    this.analysis.score = Utils.round(score, 1) * 10;
    this.analysis.increasingDividends = Utils.round(increasingDividends, 1) * 10;
    this.analysis.safety = Utils.round(safety, 1) * 10;
    this.analysis.stability = Utils.round(stability, 1) * 10;
    this.analysis.dividendHistory = Utils.round(dividendHistory, 1) * 10;
    this.analysis.DIVYIELD = Utils.round(this.currentData.DIVYIELD * 100, 2);
    
    console.log('buildDiv', {
        dividendIncreases, retainedEarningsIncreases,
        safetyList,
        dps, cleanDps,
        retainedEarnings,
        change, volatility});
    console.log('buildAnalysis', this.analysis);
  }

  buildDpsChart() {
    var ctx = document.getElementById("dpsChart");
    const list = this.company.fundamentals;
    const years = Utils.reduce(list, 'date', (val) => val.split('-')[0]);
    const dps = Utils.reduce(list, 'DPS',(val) => val);
    var data = {
        labels: years,
        datasets: [
            {
                label: 'Dividend Per Share',
                data: dps,
                fill: false,
                backgroundColor: 'rgba(249, 201, 117, 1)',
                borderColor: 'rgba(249, 201, 117, 1)'
            }

        ]
    };
    var options = {
        responsive: true,
        maintainAspectRatio: true,
        legend: {
            display: true,
            position: 'bottom',
        },
        title: {
            display: false
        },
        animation: {
          duration: 0
        },
        scales: {
            xAxes: [
                {
                    gridLines: {
                        display:false
                    },
                    ticks: {
                        display: true,
                        beginAtZero: true
                    }
                }
            ],
            yAxes: [
                {
                    gridLines: {
                        drawBorder: false,
                        display:false
                    },
                    ticks: {
                        display: false
                    }
                }
            ]
        }
    };
    var chart = new Chart(ctx, {
        type: 'line',
        data,
        options
    });
    this.charts.push(chart);
  }

  reset() {
    if (!this) {
      return;
    }
    
    this.ticker = '';
    this.currentData = {};
    this.analysis = {};
    this.company = {
      fundamentals: [],
      profile: {},
      prices: {}
    };
    this.charts.forEach(chart => {
        chart.destroy();
    });
  }
}