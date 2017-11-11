import { Component } from '@angular/core';
import { NavController, MenuController, Events } from 'ionic-angular';

import { CompanyPage } from '../company/company';
import { AngularFirestore } from 'angularfire2/firestore';


const feedComplete = (dataFeed, callback, done) => {
  if (!done) {
    dataFeed.subscribe(data => callback(data))
  }
  else {
    dataFeed.subscribe(data => callback(data, done))
  }
}

const getDocument = (db: AngularFirestore, loc, callback, done) => {
  const document = db.doc<any>(loc);
  const dataFeed = document.valueChanges();
  return feedComplete(dataFeed, callback, done);
};

const getCollection = (db: AngularFirestore,loc, callback, done) => {
  const collection = db.collection<any>(loc);
  const dataFeed = collection.valueChanges();
  return feedComplete(dataFeed, callback, done);
}

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  user: any;
  
  constructor(public navCtrl: NavController
            , public menuCtrl: MenuController
            , public events: Events
            , private afs: AngularFirestore) {
    
    this.reset();
    const userID = '000';
    getDocument(afs, `Users/${userID}`, this.userProfileReceived, '');
    
  }

  reset() {
    this.user = {
      watchlist: []
    };
  }

  private loadCompany = (ticker) => {
    
    console.log(`loadCompanyPage(${ticker})`);
    this.navCtrl.push(CompanyPage, {ticker});
  }

  private userProfileReceived = (data) => {
    console.log('userProfileReceived', data);

    this.user = data || this.user;
    const watchlist = this.user.watchlist;
    const sideMenuItems = [];

    
    watchlist.forEach(ticker => {
      sideMenuItems.push({
        name: ticker,
        onclick : () => {
          this.loadCompany(ticker);
        }
      });
    });
    
    this.events.publish('sidemenu', {
      title: 'Watchlist',
      items: sideMenuItems
    });
  }

}
