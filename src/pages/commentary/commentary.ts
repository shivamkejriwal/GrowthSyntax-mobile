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
  type: string = 'topics';

  constructor(public navCtrl: NavController, 
    public menuCtrl: MenuController,
    private afs: AngularFirestore) {
    this.articles = {
      updates: [],
      highlights: [],
      marketAndEconomy: [],
      recent: []
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
      marketAndEconomy: [],
      recent: []
    };

    const fixTitle = (item) => {
      const title = item.title.split(':')[1];
      item.title = title;
      return item;
    }

    const getSubscription = (category, limit, type, callback) => {
      const collection = this.afs.collection<any>('Articles', ref => ref
          .where('category', '==', category)
          .orderBy('date','desc')
          .limit(limit));
      if (type === 'values') {
        collection.valueChanges().subscribe(callback);
      } else {
        collection.snapshotChanges(['added']).subscribe(callback);
      }
    }

    getSubscription('Stock Market Today', 3, 'snapshot', items => {
      this.articles.updates = items
        .map(item => fixTitle(item.payload.doc.data()));
    });

    getSubscription('Stock Highlights', 3, 'snapshot', items => {
      this.articles.highlights = items
        .map(item => fixTitle(item.payload.doc.data()));
    });
    
    getSubscription('Market and Economy', 5, 'snapshot', items => {
      this.articles.marketAndEconomy = items
        .map(item => item.payload.doc.data());
    });
    
    this.getAllRecent()
  }

  getAllRecent() {
    const collection = this.afs.collection<any>('Articles', ref => ref
      .orderBy('date','desc')
      .limit(15));

    collection.snapshotChanges(['added']).subscribe(items => {
      this.articles.recent = items
        .map(item => item.payload.doc.data());
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
