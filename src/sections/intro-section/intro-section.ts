import { Component } from '@angular/core';
import { Events } from 'ionic-angular';
import Chart from 'chart.js';


@Component({
  selector: 'intro-section',
  templateUrl: 'intro-section.html'
})
export class IntroSection {
  company:any;
  charts: Array<any> = [];
  ticker: string = '';
  
  constructor(public events: Events) {
    this.events.subscribe('company', data => this.loadData(data));
    this.events.subscribe('company:reset', this.reset);
    this.reset();
  }

  private loadData = (data) => {
    console.log('IntroSection-loadData');
    this.company = data;
    const dataComplete = Boolean(data.profile.ticker
                          && data.prices.ticker
                          && data.fundamentals.length > 0);
    const tickerMismatch = Boolean(this.ticker !== data.profile.ticker);
    if(dataComplete && tickerMismatch) {
        this.ticker = this.company.profile.ticker;
        console.log('IntroSection-dataComplete', data);
        this.buildChart();
    }
  }

  buildChart() {
    var ctx = document.getElementById("polarArea");
    let data = {
        labels: [
            'Health',
            'Value',
            'Performance',
            'Dividend',
            'Management'
        ],
        datasets: [{
            data: [5, 3, 7, 8, 9],
            fillOpacity: .3,
            backgroundColor: [
                "rgba(255, 0, 0, 0.3)",
                "rgba(100, 255, 0, 0.3)",
                "rgba(200, 50, 255, 0.3)",
                "rgba(300, 100, 255, 0.3)",
                "rgba(0, 100, 255, 0.3)"
            ]
        }],
    };
    let options = {
        responsive: true,
        legend: {
            display: true,
            position: 'left'
        },
        title: {
            display: false,
            text: 'Summary'
        },
        scale: {
            display: true,
            gridLines: {
                display: false,
                drawBorder: false,
                lineWidth: 0
            },
            angleLines: {
                display: false
            },
            ticks: {
                display: false,
                suggestedMax: 10
            }
        }
    };
    var chart = new Chart(ctx, {
        type: 'polarArea',
        data: data,
        options: options
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