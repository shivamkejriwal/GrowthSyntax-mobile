import { Component } from '@angular/core';
import { NavController, MenuController, Events } from 'ionic-angular';


import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  user: any;

  constructor(public navCtrl: NavController
            , public menuCtrl: MenuController
            , public events: Events
            , afs: AngularFirestore) {
    this.user = {
      watchlist: []
    };
    
    const userID = '000';
    const document = afs.doc<any>(`Users/${userID}`);
    const userData = document.valueChanges();
    userData.subscribe(data => this.userProfileReceived(data))
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

  loadCompany(ticker) {
    console.log(`loadCompany - ${ticker}`);

  }

}
