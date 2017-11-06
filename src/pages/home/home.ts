import { Component } from '@angular/core';
import { NavController, MenuController, Events } from 'ionic-angular';


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
  company: any;

  constructor(public navCtrl: NavController
            , public menuCtrl: MenuController
            , public events: Events
            , private afs: AngularFirestore) {
    
    this.reset();
    const userID = '000';
    getDocument(afs, `Users/${userID}`, this.userProfileReceived, '');
  }

  resetCompany() {
    this.company = {
      fundamentals: [],
      profile: {},
      prices: {}
    };
    this.events.publish('company:reset');
  }

  reset() {
    this.user = {
      watchlist: []
    };
    this.resetCompany();
  }

  private userProfileReceived = (data) => {
    console.log('userProfileReceived', data);

    this.user = data || this.user;
    const watchlist = this.user.watchlist;
    const sideMenuItems = [];

    
    watchlist.forEach(ticker => {
      sideMenuItems.push({
        name: ticker,
        onclick : this.loadCompany
      });
    });
    
    this.events.publish('sidemenu', {
      title: 'Watchlist',
      items: sideMenuItems
    });
  }

  private companyProfileReceived = (data, done) => {
    console.log('companyProfileReceived', data);
    this.company.profile = data;
    if (!done) {
      this.events.publish('company', this.company);
    }
    else {
      done();
    }
  }

  private companyPricesReceived = (data, done) => {
    console.log('companyPricesReceived', data);
    this.company.prices = data;
    if (!done) {
      this.events.publish('company', this.company);
    }
    else {
      done();
    }
  }

  private companyFundamentalsReceived = (data, done) => {
    console.log('companyFundamentalsReceived', data);
    // data.sort((a, b) => a.date > b.date);
    this.company.fundamentals = data;
    if (!done) {
      this.events.publish('company', this.company);
    }
    else {
      done();
    }
  }

  private loadCompany = (ticker) => {
    console.log(`loadCompany - ${ticker}`);
    if (ticker !== this.company.ticker) {
      this.resetCompany();
    }
    this.company.ticker = ticker;

    // let count = 0;
    // const done = () => {
    //   count++;
    //   console.log(`loadCompany-done : ${count}`);
    //   if (count > 1) {
    //     this.events.publish('company', this.company);
    //   }
    // }

    getDocument(this.afs, `Companies/${ticker}/Profile/Data`, this.companyProfileReceived, '');
    getDocument(this.afs, `Companies/${ticker}/Prices/closing-price`, this.companyPricesReceived, '');
    getCollection(this.afs, `Fundamentals/${ticker}/Annual`, this.companyFundamentalsReceived, '');
  }

}
