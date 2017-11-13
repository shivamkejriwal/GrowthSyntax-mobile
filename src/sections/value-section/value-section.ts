import { Component } from '@angular/core';
import { Events } from 'ionic-angular';
import Chart from 'chart.js';
import Finance from '../finance';
import { Utils } from '../utils';


@Component({
  selector: 'value-section',
  templateUrl: 'value-section.html'
})
export class ValueSection {
  company:any;
  currentData: any = {};
  charts: Array<any> = [];
  ticker: string = '';
  
  constructor(public events: Events) {
    this.events.subscribe('company', data => this.loadData(data));
    this.events.subscribe('company:reset', this.reset);
    this.reset();
  }

  private loadData = (data) => {
    console.log('ValueSection-loadData');
    this.company = data;
    const dataComplete = Boolean(data.profile.ticker
                          && data.prices.ticker
                          && data.fundamentals.length > 0);
    const tickerMismatch = Boolean(this.ticker !== data.profile.ticker);
    if(dataComplete && tickerMismatch) {
        this.ticker = this.company.profile.ticker;
        console.log('ValueSection-dataComplete', data);
        const list = this.company.fundamentals || [];
        this.currentData = Utils.getLastObject(list);
        this.buildValueCart();
    }
  }


  evaluateDCF() {
    const sector = this.company.profile.sector;
    const growthOfMarket = 8.5;
    const riskFreeRate = 2.5;

    const timeFrame = 5;
    const risk = 1.8;
    const discountRate = (sector === 'Financial') ? growthOfMarket + riskFreeRate : growthOfMarket;
    const growthRate = (sector === 'Financial') ? riskFreeRate : '';

    const underValued  = Finance.evaluateDCF(this.company.profile, this.company.fundamentals, timeFrame, discountRate + risk, riskFreeRate, growthRate);
    const fairValue  = Finance.evaluateDCF(this.company.profile, this.company.fundamentals, timeFrame, discountRate, riskFreeRate, growthRate);
    const overValued  = Finance.evaluateDCF(this.company.profile, this.company.fundamentals, timeFrame, discountRate - risk, riskFreeRate, growthRate);
    const result = {
        underValued, fairValue, overValued
    };

    console.log('evaluateDCF', result);
    return result;

}

  buildValueCart() {
    var ctx = document.getElementById("valueChart");
    const values = this.evaluateDCF();

    const fairValuedMax = values.overValued;
    const underValuedMax = values.underValued;
    const fairValue = values.fairValue;
    const rand = (Math.random() - 0.5) * 100;
    const currentValue = Math.round(this.company.prices.price);
    const max = Math.max(values.overValued, currentValue) * 1.2;
    let data = {
        labels: [
            "Fair Value",
            "Share Price"
        ],
        datasets: [
            {
                type: 'bar',
                label: 'Prices',
                data: [fairValue, currentValue],
                backgroundColor: 'rgba(132, 152, 191, 1)',
                borderColor: 'black',
                borderWidth: 1,
                xAxisID: 'pricesX'
            },
            {
                type: 'line',
                label: 'Undervalued',
                data: [underValuedMax, underValuedMax],
                backgroundColor: 'rgba(126, 158, 123, 1)', //green
                pointRadius: 0,
                pointHoverRadius: 0,
                xAxisID: 'underValueX'
            },
            {
                type: 'line',
                label: 'About Right',
                data: [fairValuedMax, fairValuedMax],
                backgroundColor: 'rgba(249, 201, 117, 1)', //yellow
                pointRadius: 0,
                pointHoverRadius: 0,
                xAxisID: 'fairValueX'
            },
            {
                type: 'line',
                label: 'Overvalued',
                data: [max, max],
                backgroundColor: 'rgba(216, 69, 74, 1)', //red
                pointRadius: 0,
                pointHoverRadius: 0,
                xAxisID: 'overValuedX'
            }
        ]
    };
    let options = {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
            display: true,
            position: 'top',
            labels: {
                boxWidth: 15,
                filter: (item) => item.text !== 'Prices'
            }
        },
        title: {
            display: false
        },
        tooltips: {
            callbacks: {
                title: (tooltipItem, chart) => {
                    const item = tooltipItem[0];
                    return '';
                },
                label: (tooltipItem, chart) => `${tooltipItem.xLabel}: $ ${tooltipItem.yLabel}`,
            }
        },
        scales: {
            xAxes: [
                {
                    id: 'pricesX',
                    // display: true,
                    // fontSize: 50,
                    // fontStyle:'bold',
                    ticks: {
                        display: true,
                        beginAtZero: true,
                        fontSize: 15
                    },
                    gridLines: {
                        display:false
                    },
                    categoryPercentage: 1,
                    barPercentage: .6
                },
                {
                    id: 'underValueX',
                    ticks: {
                        beginAtZero: true,
                        display: false
                    },
                    gridLines: {
                        drawBorder: false,
                        display:false
                    }
                },
                {
                    id: 'fairValueX',
                    ticks: {
                        beginAtZero: true,
                        display: false
                    },
                    gridLines: {
                        drawBorder: false,
                        display:false
                    }
                },
                {
                    id: 'overValuedX',
                    ticks: {
                        beginAtZero: true,
                        display: false
                    },
                    gridLines: {
                        drawBorder: false,
                        display:false
                    }
                }
            ],
            yAxes: [
                {
                    gridLines: {
                        display:false
                    },
                    ticks: {
                        display: false,
                        min: 0,
                        max: max
                    }
                }
            ]
        },
        animation: {
            onComplete: function() {
                const getFontString = (ctx, newSize) => {
                    const fontArgs = ctx.font.split(' ');
                    return `${newSize} ${fontArgs[fontArgs.length - 1]}`;
                };
                const chartInstance = this.chart
                const ctx = this.chart.ctx;
                const datasets = this.data.datasets;
                ctx.font = getFontString(ctx, '20px');
                ctx.fillStyle = 'black';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';
                datasets.forEach(function (dataset, i) {
                    var meta = chartInstance.controller.getDatasetMeta(i);
                    if (meta.type === 'bar') {
                        console.log('meta',meta);
                        meta.data.forEach(function (bar, index) {
                            var data = dataset.data[index];
                            ctx.fillText(`$ ${data}`, bar._model.x, bar._model.y - 5);
                        });
                    }
                });
            }
        }
    }
    var chart = new Chart(ctx, {
        type: 'bar',
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
    this.company = {
      fundamentals: [],
      profile: {},
      prices: {}
    };
    this.charts.forEach(chart => {
        // chart.data.labels.pop();
        // chart.data.datasets.forEach((dataset) => {
        //     dataset.data.pop();
        // });
        // chart.update();
        chart.destroy();
    });
  }
}