import { Component } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';
import { ArticlePage } from '../article/article';
import { AngularFirestore } from 'angularfire2/firestore';

import { Utils } from '../../sections/utils';
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

    const fixArticleData = (article, fixTitle) => {
      if(fixTitle) {
        const title = article.title.split(':')[1];
        article.title = title;
      }
      article.timeSince = this.getTime(article.date);
      article.avatar = this.getAvatar(article.author);
      return article;
    }

    const getSubscription = (category, limit, callback) => {
      const collection = this.afs.collection<any>('Articles', ref => ref
          .where('category', '==', category)
          .orderBy('date','desc')
          .limit(limit));
      collection.snapshotChanges(['added']).subscribe(callback);
    }

    getSubscription('Stock Market Today', 3, items => {
      this.articles.updates = items
        .map(item => fixArticleData(item.payload.doc.data(), true));
    });

    getSubscription('Stock Highlights', 3, items => {
      this.articles.highlights = items
        .map(item => fixArticleData(item.payload.doc.data(), true));
    });
    
    getSubscription('Market and Economy', 5, items => {
      this.articles.marketAndEconomy = items
        .map(item => fixArticleData(item.payload.doc.data(), false));
    });
    
    this.getAllRecent()
  }

  getAllRecent() {
    const collection = this.afs.collection<any>('Articles', ref => ref
      .orderBy('date','desc')
      .limit(15));

    collection.snapshotChanges(['added']).subscribe(items => {
      this.articles.recent = items
        .map(item => {
          const article = item.payload.doc.data();
          if(article.category === 'Stock Market Today') {
            article.title = article.title.split(':')[1];
          }
          article.timeSince = this.getTime(article.date);
          article.avatar = this.getAvatar(article.author);
          return article;
        });
    });
  }

  showArticle(article) {
    // console.log('articles',this.articles);
    // console.log('article',article);
    this.navCtrl.push(ArticlePage, {article});
  }

  getAvatar(author) {
    const avatars = {
      'vanguard.com': 'assets/imgs/vanguard.jpg',
      'valueline.com': 'assets/imgs/valueline-withText.png',
      'blackrock.com': 'assets/imgs/blackrock.jpg',
      'bloomberg.com': 'assets/imgs/bloomberg.jpg',
      'schwab.com': 'assets/imgs/CharlesSchwab.png'
    }
    return avatars[author] || '';
  }

  getTime(pubDate) {
    const split = pubDate.split('-');
    const publication = {
      year: parseInt(split[0]),
      month: parseInt(split[1]),
      day: parseInt(split[2]),
      hour: parseInt(split[3])
    };
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const day = today.getDate();
    const hour = today.getHours();
    if(year > publication.year) return `${year-publication.year} years ago`;
    else if(month > publication.month) return `${month-publication.month} months ago`;
    else if(day > publication.day) return `${day-publication.day} days ago`;
    else if(hour > publication.hour) return `${hour-publication.hour} hours ago`;
    else return `${split[0]}-${split[1]}-${split[2]}`;
  }

  swipeEvent(e) {
    const direction = Utils.getDirection(e);
    if ( direction=== 'right') {
      this.type = 'topics'
    }
    if (direction === 'left') {
      this.type = 'recent'
    }
    console.log('swipeEvent', direction);
  }

  ionViewDidEnter() {
    this.menuCtrl.enable(false,'sidemenu');
  }

}
