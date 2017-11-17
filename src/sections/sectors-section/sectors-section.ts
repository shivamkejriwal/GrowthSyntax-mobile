import { Component } from '@angular/core';
import { Events } from 'ionic-angular';
import { AngularFirestore } from 'angularfire2/firestore';
import { Utils } from '../utils';

const getIconMappings = () => {
    return {
        'Basic Industries': 'cog',
        'Finance': 'stats',
        'Capital Goods': 'construct',
        'Healthcare': 'medkit',
        'Health Care': 'medkit',
        'Consumer Durables': 'cart',
        'Miscellaneous': 'basket',
        'Consumer Non-Durables': 'pricetags',
        'Public Utilities': 'bulb',
        'Consumer Services': 'contacts',
        'Technology': 'battery-charging',
        'Energy': 'flame',
        'Transportation': 'subway'
    };
}

@Component({
  selector: 'sectors-section',
  templateUrl: 'sectors-section.html'
})
export class SectorsSection {
    sectorMapings: any = {};
    sectors: any = [];
    isReady: boolean = false;
    constructor(private afs: AngularFirestore) {
        this.sectorMapings = getIconMappings();
        this.getData();
    }

    getData() {
        const collection = this.afs.collection<any>('Sector');
        collection.snapshotChanges(['added'])
        .subscribe(items => {
            this.sectors = items.map(item => {
                const data = item.payload.doc.data();
                data.icon = this.sectorMapings[data.name];
                data.change = Utils.round(data.change/data.open * 100, 2);
                // console.log(data);
                return data;
            });
            this.isReady = true;
        });
    }

}