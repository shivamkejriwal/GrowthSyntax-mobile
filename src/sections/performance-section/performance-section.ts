import { Component } from '@angular/core';
import { Events } from 'ionic-angular';
import Chart from 'chart.js';
import { Utils } from '../utils';


@Component({
  selector: 'performance-section',
  templateUrl: 'performance-section.html'
})
export class PerformanceSection {
  company:any;
  currentData: any = {};
  charts: Array<any> = [];
  ticker: string = '';
  
  constructor(public events: Events) {
    this.events.subscribe('company', this.loadData);
    this.events.subscribe('company:reset', this.reset);
    this.reset();
  }

  private loadData = (data) => {
    console.log('PerformanceSection-loadData');
    this.company = data;
    const dataComplete = Boolean(data.profile.ticker
                          && data.prices.ticker
                          && data.fundamentals.length > 0);
    const tickerMismatch = Boolean(this.ticker !== data.profile.ticker);
    if(dataComplete && tickerMismatch) {
        this.ticker = this.company.profile.ticker;
        console.log('PerformanceSection-dataComplete', data);
        const list = this.company.fundamentals || [];
        this.currentData = Utils.getLastObject(list);
        this.buildEarningsChart();
    }
  }

  buildEarningsChart() {
    var ctx = document.getElementById("earningsChart");
    const list = this.company.fundamentals;
    const years = Utils.reduce(list, 'date', (val) => val.split('-')[0]);
    const revenue = Utils.reduce(list, 'REVENUE',(val) => val);
    const netIncome = Utils.reduce(list, 'NETINC', (val) => val);
    var data = {
        labels: years,
        datasets: [
            {
                label: 'Earnings',
                data: netIncome,
                // fill: false,
                backgroundColor: 'rgba(249, 201, 117, 1)'
            },
            {
                label: 'Revenue',
                data: revenue,
                // fill: false,
                backgroundColor: 'rgba(126, 158, 123, 1)'
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