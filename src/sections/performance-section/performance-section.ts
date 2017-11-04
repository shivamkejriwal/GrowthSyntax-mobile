import { Component } from '@angular/core';
import { Events } from 'ionic-angular';

@Component({
  selector: 'performance-section',
  templateUrl: 'performance-section.html'
})
export class PerformanceSection {
  company:any;
  
  constructor(public events: Events) {
    this.events.subscribe('company', this.loadData);
  }

  private loadData = (data) => {
    console.log('PerformanceSection-loadData', data);
    this.company = data;
  }
}