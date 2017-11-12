import { Component } from '@angular/core';
import { Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';

import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable, Subscription } from 'rxjs';

const getCollection = (db:AngularFirestore, queryString:string, limit: number) => {
  const qs = queryString.toUpperCase();
  const nextChar = (c) => String.fromCharCode(c.charCodeAt(0) + 1);
  const incrementString = (str) => {
    const lastChar = queryString.slice(-1);
    const beg = queryString.slice(0, -1);
    return `${beg}${nextChar(lastChar)}`
  };

  const queryByTicker = db.collection<any>('Companies', ref => { 
      return ref.where('ticker', '>=', qs)
              .where('ticker','<' , incrementString(qs))
              .limit(limit);
    }).valueChanges();
  const queryByName = db.collection<any>('Companies', ref => { 
    return ref.where('name', '>=', qs)
            .where('name','<' , incrementString(qs))
            .limit(limit);
  }).valueChanges();

  return Observable.merge(queryByTicker, queryByName);
}

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = null;
  authState: any = null;
  sideMenu:any;
  searchItems:Array<any> = [];
  searchSubscription: Subscription;

  constructor(platform: Platform,
          public events: Events,
          statusBar: StatusBar,
          splashScreen: SplashScreen,
          public afAuth: AngularFireAuth,
          private afs: AngularFirestore) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      
    });
    this.setupAuth();
    this.setupMenu();
  }

  setupAuth() {
    const authSubscription = this.afAuth.authState.subscribe(auth => {
      this.getUserProfile(auth).then(profile => {
        this.rootPage = (profile) ? TabsPage : LoginPage;
        authSubscription.unsubscribe();
        // if (profile) {
        //   authSubscription.unsubscribe();
        // }
        console.log('MyApp-setupAuth', this.authState);
      })
    });
  }

  getUserProfile(auth): any {
    this.authState = auth;
    const uid = this.authState ? this.authState.uid : ''
    if (!uid) {
        return Promise.resolve(false);
    }
    const loc = `/Users/${uid}`;
    const doc = this.afs.doc(loc);
    return doc.valueChanges().take(1).toPromise();
  }

  clearSearch() {
    this.searchItems = [];
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  getSearchItems(event) {
    console.log('getSearchItems', event);
    const val = event.target.value;
    this.clearSearch();

    const fill = (queriedItems) => queriedItems.forEach(item => {
      const exists = this.searchItems.some(ele => ele.ticker === item.ticker);
      if(!exists) {
        this.searchItems.push(item);
      }
    });
    
    if (val && val.trim() != '') {
      const query = getCollection(this.afs, val, 2).subscribe(fill);
      this.searchSubscription = query;
    }
  }

  private setupMenu = () => {
    this.sideMenu = {
      title : 'Side Menu',
      items : []
    }
    this.events.subscribe('sidemenu', (data) => {
      // user and time are the same arguments passed in `events.publish(user, time)`
      console.log('sidemenu-event', data);
      this.sideMenu = data;
    });
  }

  loadCompany(ticker) {
    console.log(`loadCompany(MyApp) - ${ticker}`);
    this.events.publish('loadCompany', ticker);
  }
  
}
