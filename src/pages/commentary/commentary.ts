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
      highlights: []
    };
    this.loadArticles();
  }

  goToProfile() {
    this.navCtrl.push(LoginPage);
  }

  loadArticles() {
    this.articles = {
      updates: [],
      highlights: []
    };
    const getUpdates = this.afs.collection<any>('Articles', ref => { 
      return ref.where('category', '==', 'Stock Market Today').limit(3);
    }).valueChanges();

    const getHighlights = this.afs.collection<any>('Articles', ref => { 
      return ref.where('category', '==', 'Stock Highlights').limit(3);
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
  }

  showArticle(article) {
    console.log('article',article);
    this.navCtrl.push(ArticlePage, {article});
  }

  ionViewDidEnter() {
    this.menuCtrl.enable(false,'sidemenu');
  }

}
