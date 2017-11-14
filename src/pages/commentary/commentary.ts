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

    const fixTitle = (item) => {
      const title = item.title.split(':')[1];
      item.title = title;
      return item;
    }

    const getSubscription = (category, limit, callback) => {
      this.afs.collection<any>('Articles', ref => ref
          .where('category', '==', category)
          .orderBy('date','desc')
          .limit(limit))
        .valueChanges().subscribe(callback);
    }

    getSubscription('Stock Market Today', 3, items => {
      this.articles.updates = items.map(item => fixTitle(item));
    });

    getSubscription('Stock Highlights', 3, items => {
      this.articles.highlights = items.map(item => fixTitle(item));
    });
    
    getSubscription('Market and Economy', 5, items => {
      this.articles.marketAndEconomy = items;
    });
    
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
