import { Component } from '@angular/core';
import { Events } from 'ionic-angular';

@Component({
  selector: 'intro-section',
  templateUrl: 'intro-section.html'
})
export class IntroSection {
  company:any;
  
  constructor(public events: Events) {
    this.company = {
      profile: {},
      prices: {}
    };
    this.events.subscribe('company', data => this.loadData(data));
  }

  private loadData = (data) => {
    console.log('IntroSection-loadData', data);
    this.company = data;
  }
}