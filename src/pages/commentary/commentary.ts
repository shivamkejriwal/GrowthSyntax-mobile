import { Component } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';
import { ArticlePage } from '../article/article';
import { AngularFirestore } from 'angularfire2/firestore';

import { LoginPage } from '../login/login';

@Component({
  selector: 'page-commentary',
  templateUrl: 'commentary.html'
})
export class CommentaryPage {
  articles: any;

  constructor(public navCtrl: NavController, 
    public menuCtrl: MenuController,
    private afs: AngularFirestore) {
    this.articles = {
      updates: [],
      highlights: [],
      marketAndEconomy: []
    };
    this.loadArticles();
  }

  goToProfile() {
    this.navCtrl.push(LoginPage);
  }

  loadArticles() {
    this.articles = {
      updates: [],
      highlights: [],
      marketAndEconomy: []
    };
    const getUpdates = this.afs.collection<any>('Articles', ref => { 
      return ref.where('category', '==', 'Stock Market Today')
                .orderBy('date','desc')
                .limit(3);
    }).valueChanges();

    const getHighlights = this.afs.collection<any>('Articles', ref => { 
      return ref.where('category', '==', 'Stock Highlights')
                .orderBy('date','desc')
                .limit(3);
    }).valueChanges();

    const getMarketAndEconomy = this.afs.collection<any>('Articles', ref => { 
      return ref.where('category', '==', 'Market and Economy')
                .orderBy('date','desc')
                .limit(5);
    }).valueChanges();

    getUpdates.subscribe(items => items.forEach(item => {
      const title = item.title.split(':')[1];
      item.title = title;
      this.articles.updates.push(item);
    }));

    getHighlights.subscribe(items => items.forEach(item => {
      const title = item.title.split(':')[1];
      item.title = title;
      this.articles.highlights.push(item);
    }));

    getMarketAndEconomy.subscribe(items => items.forEach(item => {
      this.articles.marketAndEconomy.push(item);
    }));
  }

  showArticle(article) {
    // console.log('articles',this.articles);
    console.log('article',article);
    this.navCtrl.push(ArticlePage, {article});
  }

  ionViewDidEnter() {
    this.menuCtrl.enable(false,'sidemenu');
  }

}
