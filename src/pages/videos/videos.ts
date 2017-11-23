import { Component } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';
import { AngularFirestore } from 'angularfire2/firestore';

import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player';
import { BrowserTab } from '@ionic-native/browser-tab';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { Utils } from '../../sections/utils';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-videos',
  templateUrl: 'videos.html'
})
export class VideosPage {
    type: string = 'all';
    videos: any = {};

    constructor(public navCtrl: NavController,
        public menuCtrl: MenuController,
        private youtube: YoutubeVideoPlayer,
        private afs: AngularFirestore,
        private iab: InAppBrowser,
        private browserTab: BrowserTab) {
        this.videos = {
            all: [],
            stocks: [],
            economy: []
        }
        this.getAllRecent();
        this.getAllByCategory();
    }

    getAllByCategory() {
        const getSubscription = (category, limit, callback) => {
            const collection = this.afs.collection<any>('Videos', ref => ref
                .where('category', '==', category)
                .orderBy('date','desc')
                .limit(limit));
            collection.snapshotChanges(['added']).subscribe(callback);
        }

        getSubscription('Stock Highlights', 10, items => {
            this.videos.stocks = items.map(item => {
                const video = item.payload.doc.data();
                video.timeSince = this.getTime(video.date);
                return video;
            });
        });

        getSubscription('Economic Outlook', 10, items => {
            items.forEach(item => {
                const video = item.payload.doc.data();
                video.timeSince = this.getTime(video.date);
                this.videos.economy.push(video);
            });
        });

        getSubscription('Market Snapshot', 10, items => {
            items.forEach(item => {
                const video = item.payload.doc.data();
                video.timeSince = this.getTime(video.date);
                this.videos.economy.push(video);
            });
        });
    }

    getAllRecent() {
        const collection = this.afs.collection<any>('Videos', ref => ref
            .orderBy('date','desc')
            .limit(15));

        collection.snapshotChanges(['added']).subscribe(items => {
            this.videos.all = items
            .map(item => {
                const video = item.payload.doc.data();
                video.timeSince = this.getTime(video.date);
                return video;
            });
        });
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

    
    goToProfile() {
        this.navCtrl.push(LoginPage);
    }

    openVideoInApp(video) {
        console.log(video);
        this.youtube.openVideo(video.videoId);
    }

    openVideoInBrowser(video) {
        console.log(video);
        const url = video.link;
        this.browserTab.isAvailable()
        .then((isAvailable: boolean) => {
            console.log('browserTab-isAvailable' + isAvailable);
            if (isAvailable) {
            this.browserTab.openUrl(url);
            } else {
            const browser = this.iab.create(url);
            }
        });
    }

    swipeEvent(e) {
        const sequence = ['all', 'stocks', 'economy'];
        const direction = Utils.getDirection(e);
        const current = sequence.indexOf(this.type);
        const getNext = (i) => (i < 0) ?  0: (i > 2) ?  2 : i;
        
        if ( direction=== 'right') {
            this.type = sequence[getNext(current - 1)];
        }
        if (direction === 'left') {
            this.type = sequence[getNext(current + 1)];
        }
        console.log('swipeEvent', direction);
    }

    ionViewDidEnter() {
        this.menuCtrl.enable(false,'sidemenu');
    }

}
