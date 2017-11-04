import { Component } from '@angular/core';
import { Events } from 'ionic-angular';

@Component({
  selector: 'value-section',
  templateUrl: 'value-section.html'
})
export class ValueSection {
  company:any;
  
  constructor(public events: Events) {
    this.events.subscribe('company', this.loadData);
  }

  private loadData = (data) => {
    console.log('ValueSection-loadData', data);
    this.company = data;
  }
}