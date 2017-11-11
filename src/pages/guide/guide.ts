import { Component } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';

@Component({
  selector: 'page-guide',
  templateUrl: 'guide.html'
})
export class GuidePage {

  constructor(public navCtrl: NavController,
    public menuCtrl: MenuController) {

  }

  ionViewDidEnter() {
    this.menuCtrl.enable(false,'sidemenu');
  }

}
