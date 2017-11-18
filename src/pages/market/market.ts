import { Component } from '@angular/core';
import { NavController, MenuController, Events } from 'ionic-angular';

import { CompanyPage } from '../company/company';
import { AngularFirestore } from 'angularfire2/firestore';
import { Utils } from '../../sections/utils';

import { LoginPage } from '../login/login';
import { IndustrySection } from '../../sections/industry-section/industry-section';

import { AuthenticationService } from '../../services/authentication';


@Component({
  selector: 'page-market',
  templateUrl: 'market.html'
})
export class MarketPage {
  user: any;
  dailyData:any = {};
  trades: string = 'active';
  
  constructor(public navCtrl: NavController, 
    public menuCtrl: MenuController, 
    public events: Events, 
    private afs: AngularFirestore,
    private authService: AuthenticationService) {
    
    this.reset();
    this.loadDailyData();
    this.events.subscribe('loadCompany', ticker => {
      this.menuCtrl.close();
      this.loadCompany(ticker);
    });

    authService.loggedInUser()
    .then(this.userProfileReceived)
    .catch(err => console.log('authService', err));
    
  }

  goToProfile() {
    this.navCtrl.push(LoginPage);
  }

  goToIndustry() {
    this.navCtrl.push(IndustrySection);
  }

  get reportDate() {
    const mostTraded = this.dailyData.mostTraded;
    const dateString = mostTraded 
              && mostTraded[0]
              && mostTraded[0].date;
    return dateString || '';
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
    console.log(`reportDate: ${this.reportDate}`);
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

  swipeEvent(e) {
    const sequence = ['gainers', 'losers', 'active'];
    const direction = Utils.getDirection(e);
    const current = sequence.indexOf(this.trades);
    const getNext = (i) => (i < 0) ?  0: (i > 2) ?  2 : i;
    
    if ( direction=== 'right') {
      this.trades = sequence[getNext(current - 1)];
    }
    if (direction === 'left') {
      this.trades = sequence[getNext(current + 1)];
    }
    console.log('swipeEvent', direction);
  }

  ionViewDidEnter() {
    this.menuCtrl.enable(true,'sidemenu');
  }

}
