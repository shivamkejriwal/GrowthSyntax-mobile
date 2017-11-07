import { Component } from '@angular/core';
import { Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';

import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';

const getCollection = (db:AngularFirestore, queryString:string, limit: numer) => {
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
  rootPage:any = TabsPage;
  sideMenu:any;
  searchItems:Array<any> = []

  constructor(platform: Platform
          , public events: Events
          , statusBar: StatusBar
          , splashScreen: SplashScreen
          , private afs: AngularFirestore) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      
    });
    this.setupMenu();
  }

  getSearchItems(event) {
    console.log('getSearchItems', event);
    const val = event.target.value;
    this.searchItems = [];
    if (val && val.trim() != '') {
      getCollection(this.afs, val, 3).subscribe(queriedItems => {
        queriedItems.forEach(item => this.searchItems.push(item));
      });
    }
    if (!val) {
      this.searchItems = [];
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
  
}
