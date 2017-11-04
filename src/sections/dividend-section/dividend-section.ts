import { Component } from '@angular/core';
import { Events } from 'ionic-angular';

@Component({
  selector: 'dividend-section',
  templateUrl: 'dividend-section.html'
})
export class DividendSection {
  company:any;

  constructor(public events: Events) {
    this.events.subscribe('company', this.loadData);
  }

  private loadData = (data) => {
    console.log('DividendSection-loadData', data);
    this.company = data;
  }
}