import { Component } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  satisfaction: Number = 0;
  constructor(public navCtrl: NavController,
    public menuCtrl: MenuController) {

  }

  ionViewDidEnter() {
    this.menuCtrl.enable(false,'sidemenu');
  }

}
