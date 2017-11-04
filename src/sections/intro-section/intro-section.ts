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
    this.events.subscribe('company', this.loadData);
    this.events.subscribe('company:reset', this.reset);
    this.reset();
  }

  private loadData = (data) => {
    console.log('IntroSection-loadData');
    this.company = data;
    const dataComplete = Boolean(data.profile.ticker
                          && data.prices.ticker
                          && data.fundamentals.length > 0);
    if(dataComplete) {
      console.log('IntroSection-dataComplete', data);
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