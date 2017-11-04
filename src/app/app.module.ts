import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { GuidePage } from '../pages/guide/guide';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Firebase } from '@ionic-native/firebase';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';

var firebaseConfig = {
  apiKey: "AIzaSyANdvBeknttAYM332pxDOIi9DYs7vNfm_w",
  authDomain: "growthsyntax.firebaseapp.com",
  databaseURL: "https://growthsyntax.firebaseio.com",
  projectId: "growthsyntax",
  storageBucket: "growthsyntax.appspot.com",
  messagingSenderId: "490207480094"
};
// firebase.initializeApp(config);

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    GuidePage,
    HomePage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    AngularFirestoreModule.enablePersistence(), // Offline Data
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    GuidePage,
    HomePage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Firebase,
    AngularFireDatabase,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
