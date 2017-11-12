import { Component } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';

import { LoginPage } from '../login/login';

@Component({
  selector: 'page-guide',
  templateUrl: 'guide.html'
})
export class GuidePage {

  constructor(public navCtrl: NavController,
    public menuCtrl: MenuController) {

  }

  goToProfile() {
    this.navCtrl.push(LoginPage);
  }

  ionViewDidEnter() {
    this.menuCtrl.enable(false,'sidemenu');
  }

}
