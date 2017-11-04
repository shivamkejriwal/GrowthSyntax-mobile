import { Component } from '@angular/core';
import { Events } from 'ionic-angular';

@Component({
  selector: 'health-section',
  templateUrl: 'health-section.html'
})
export class HealthSection {
  company:any;
  
  constructor(public events: Events) {
    this.events.subscribe('company', this.loadData);
  }

  private loadData = (data) => {
    console.log('HealthSection-loadData', data);
    this.company = data;
  }
}