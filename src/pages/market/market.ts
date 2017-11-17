import { Component } from '@angular/core';
import { NavController, MenuController, Events } from 'ionic-angular';

import { CompanyPage } from '../company/company';
import { AngularFirestore } from 'angularfire2/firestore';
import { Utils } from '../../sections/utils';

import { LoginPage } from '../login/login';
import { IndustrySection } from '../../sections/industry-section/industry-section';
 
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
  selector: 'page-market',
  templateUrl: 'market.html'
})
export class MarketPage {
  user: any;
  dailyData:any = {};
  trades: string = 'gainers';
  marketMovement: any = {};
  
  
  constructor(public navCtrl: NavController, 
    public menuCtrl: MenuController, 
    public events: Events, 
    private afs: AngularFirestore) {
    
    this.reset();
    const userID = '000';
    getDocument(afs, `Users/${userID}`, this.userProfileReceived, '');
    this.loadDailyData();
    this.events.subscribe('loadCompany', ticker => {
      this.menuCtrl.close();
      this.loadCompany(ticker);
      // this.navCtrl.popToRoot().then(() => this.loadCompany(ticker));
      // this.loadCompany(ticker);
    });
    this.marketMovement = {
      advancers: 2500,
      decliners: 3000,
      total: 5500
    }
    
  }

  goToProfile() {
    this.navCtrl.push(LoginPage);
  }

  goToIndustry() {
    this.navCtrl.push(IndustrySection);
  }

  reset() {
    this.user = {
      watchlist: []
    };
    this.dailyData = {
      mostBought: [],
      mostSold: [],
      mostTraded: []
    }
  }

  loadDailyData = () => {

    const createSubscription = (key, callback) => {
      const collection = this.afs
      .collection<any>('Companies', ref => { 
        return ref.where(key, '==', true);
      }).snapshotChanges(['added']).subscribe(callback);
    }
      
    const pushValue = (items, array) => items.forEach(item => {
      const data = item.payload.doc.data();
      const change = Utils.round(((data.close - data.open)/data.open) * 100, 2);
      data.change = change;
      data.color = data.close > data.open ? 'green' : 'red';
      array.push(data);
    });

    createSubscription('mostBought', items => pushValue(items, this.dailyData.mostBought));
    createSubscription('mostSold', items => pushValue(items, this.dailyData.mostSold));
    createSubscription('mostTraded', items => pushValue(items, this.dailyData.mostTraded));

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

  ionViewDidEnter() {
    this.menuCtrl.enable(true,'sidemenu');
  }

}
