import { Component } from '@angular/core';
import { Events } from 'ionic-angular';
import Chart from 'chart.js';


@Component({
  selector: 'management-section',
  templateUrl: 'management-section.html'
})
export class ManagementSection {
  company:any;
  charts: Array<any> = [];
  ticker: string = '';
  
  constructor(public events: Events) {
    this.events.subscribe('company', this.loadData);
    this.events.subscribe('company:reset', this.reset);
    this.reset();
  }

  private loadData = (data) => {
    console.log('ManagementSection-loadData');
    this.company = data;
    const dataComplete = Boolean(data.profile.ticker
                          && data.prices.ticker
                          && data.fundamentals.length > 0);
    if(dataComplete) {
      console.log('ManagementSection-dataComplete', data);
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