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
