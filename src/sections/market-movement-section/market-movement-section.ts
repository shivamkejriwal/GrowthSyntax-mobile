import { Component } from '@angular/core';
import { Events } from 'ionic-angular';
import { AngularFirestore } from 'angularfire2/firestore';
import { Utils } from '../utils';

@Component({
  selector: 'market-movement-section',
  templateUrl: 'market-movement-section.html'
})
export class MarketMovementSection {
    marketMovement: any = {};
    
    constructor(private afs: AngularFirestore) {
        this.marketMovement = {
            advancers: 0,
            decliners: 0,
            total: 0
          }
        this.getData();
    }

    getData() {
        const document = this.afs.doc<any>('Market-Data/Advancers-Decliners');
        const dataFeed = document.valueChanges();
        dataFeed.subscribe(items => {
            this.marketMovement.advancers = items.advancers;
            this.marketMovement.decliners = items.decliners;
            this.marketMovement.total = items.advancers + items.decliners;
            console.log(items);
        });
    }

}