import { Component } from '@angular/core';
import { Events } from 'ionic-angular';

@Component({
  selector: 'management-section',
  templateUrl: 'management-section.html'
})
export class ManagementSection {
  company:any;
  
  constructor(public events: Events) {
    this.events.subscribe('company', this.loadData);
  }

  private loadData = (data) => {
    console.log('ManagementSection-loadData', data);
    this.company = data;
  }
}