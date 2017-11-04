import { Component } from '@angular/core';
import { Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = TabsPage;
  sideMenu:any;
  tickerList:Array<any> = []
  searchItems:Array<any> = []

  constructor(platform: Platform
          , public events: Events
          , statusBar: StatusBar
          , splashScreen: SplashScreen) {
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
    if (val && val.trim() != '') {
      this.searchItems = this.tickerList.filter((item) => {
        return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
    }
    if (!val) {
      this.searchItems = [];
    }
  }

  private setupMenu = () => {
    this.tickerList = [
      'HBI',
      'VFC',
      'WFC',
      'NKE',
      'GOOGL'
    ];
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
