import { Component } from '@angular/core';
import { Events } from 'ionic-angular';
import Chart from 'chart.js';
import { Utils } from '../utils';

@Component({
  selector: 'health-section',
  templateUrl: 'health-section.html'
})
export class HealthSection {
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
    console.log('HealthSection-loadData');
    this.company = data;
    const dataComplete = Boolean(data.profile.ticker
                          && data.prices.ticker
                          && data.fundamentals.length > 0);
    if(dataComplete) {
      console.log('HealthSection-dataComplete', data);
      const list = this.company.fundamentals || [];
      this.currentData = Utils.getLastObject(list);
      this.buildNetWorthChart();
    }
  }


  buildNetWorthChart() {
    var ctx = document.getElementById("netWorthChart");
    const list = this.company.fundamentals;
    const years = Utils.reduce(list, 'date', (val) => val.split('-')[0]);
    const equity = Utils.reduce(list, 'EQUITY',(val) => val);
    const debt = Utils.reduce(list, 'DEBT', (val) => val);
    var data = {
        labels: years,
        datasets: [
            {
                label: 'Debt',
                data: debt,
                // fill: false,
                backgroundColor: 'rgba(191, 113, 84, .8)'
            },
            {
                label: 'Net Worth',
                data: equity,
                // fill: false,
                backgroundColor: 'rgba(126, 158, 123, 1)'
            }

        ]
    };
    var options = {
        responsive: true,
        maintainAspectRatio: false,
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