import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { AngularFirestore } from 'angularfire2/firestore';

const feedComplete = (dataFeed, callback, done) => {
    if (!done) {
        dataFeed.subscribe(data => callback(data))
    }
    else {
        dataFeed.subscribe(data => callback(data, done))
    }
}

const getDocument = (db: AngularFirestore, loc, callback, done) => {
    const document = db.doc<any>(loc);
    const dataFeed = document.valueChanges();
    return feedComplete(dataFeed, callback, done);
};

const getCollection = (db: AngularFirestore,loc, callback, done) => {
    const collection = db.collection<any>(loc);
    const dataFeed = collection.valueChanges();
    return feedComplete(dataFeed, callback, done);
}

@Component({
  selector: 'page-company',
  templateUrl: 'company.html'
})
export class CompanyPage {
    ticker: string;
    isReady: boolean = false;
    company: any;

    constructor(public navCtrl: NavController, 
                public events: Events, 
                public navParams: NavParams,
                private afs: AngularFirestore) {
    
        this.ticker = this.navParams.get('ticker');
        console.log('CompanyPage', this.ticker);
        
        this.resetCompany().then(()=> {
            this.loadCompany(this.ticker);
        });
        
    }

    resetCompany() {
        this.company = {
            fundamentals: [],
            profile: {},
            prices: {}
        };

        const lastPage = this.navCtrl.last();
        if (lastPage.name == 'CompanyPage') {
            console.log('resetCompany-again')
            return this.navCtrl.removeView(lastPage);
        }
        return Promise.resolve();
        // this.events.publish('company:reset');
    }

    private companyProfileReceived = (data, done) => {
        console.log('companyProfileReceived', data);
        this.company.profile = data ? data : {};
        if (!done) {
            this.events.publish('company', this.company);
        }
        else {
            done();
        }
    }
    
    private companyPricesReceived = (data, done) => {
        console.log('companyPricesReceived', data);
        this.company.prices = data ? data : {};
        if (!done) {
            this.events.publish('company', this.company);
        }
        else {
            done();
        }
    }
    
    private companyFundamentalsReceived = (data, done) => {
        console.log('companyFundamentalsReceived', data);
        // data.sort((a, b) => a.date > b.date);
        this.company.fundamentals = data ? data : [];
        if (!done) {
            this.events.publish('company', this.company);
        }
        else {
            done();
        }
    }
    
    private loadCompany = (ticker) => {
        console.log(`loadCompany - ${ticker}`);
        // if (ticker !== this.company.ticker) {
        //     this.resetCompany();
        // }
        this.company.ticker = ticker;
        this.isReady = true;

        // let count = 0;
        // const done = () => {
        //   count++;
        //   console.log(`loadCompany-done : ${count}`);
        //   if (count > 1) {
        //     this.events.publish('company', this.company);
        //   }
        // }

        getDocument(this.afs, `Companies/${ticker}/Profile/Data`, this.companyProfileReceived, '');
        getDocument(this.afs, `Companies/${ticker}/Prices/closing-price`, this.companyPricesReceived, '');
        getCollection(this.afs, `Fundamentals/${ticker}/Annual`, this.companyFundamentalsReceived, '');
    }

}