import { Component } from '@angular/core';
import { Events } from 'ionic-angular';
import Chart from 'chart.js';


@Component({
  selector: 'performance-section',
  templateUrl: 'performance-section.html'
})
export class PerformanceSection {
  company:any;
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
    if(dataComplete) {
      console.log('PerformanceSection-dataComplete', data);
    }
  }

  reset() {
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