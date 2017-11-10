import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { BrowserTab } from '@ionic-native/browser-tab';

@Component({
  selector: 'page-article',
  templateUrl: 'article.html'
})
export class ArticlePage {
  private article: any = {};
  constructor(public platform: Platform,
              public navCtrl: NavController, 
              public navParams: NavParams,
              private browserTab: BrowserTab) {
    this.article = this.navParams.get('article');
    console.log('ArticlePage', this.article);
  }

  goToOriginalContent() {
    const url = this.article.url;
    const isMac = this.platform.is('ios');
    const desktop = this.platform.is('core');
    if (isMac || desktop) {
      window.open(url);
    }
    else {
      this.browserTab.isAvailable()
      .then((isAvailable: boolean) => {
        console.log('browserTab-isAvailable' + isAvailable);
        if (isAvailable) {
          this.browserTab.openUrl(url);
        }
      });
    }
  }

}

