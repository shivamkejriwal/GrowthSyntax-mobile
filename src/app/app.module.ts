import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserTab } from '@ionic-native/browser-tab';

import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { GuidePage } from '../pages/guide/guide';
import { HomePage } from '../pages/home/home';
import { ArticlePage } from '../pages/article/article';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Firebase } from '@ionic-native/firebase';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';


import { ValueSection } from '../sections/value-section/value-section';
import { HealthSection } from '../sections/health-section/health-section';
import { DividendSection } from '../sections/dividend-section/dividend-section';
import { ManagementSection } from '../sections/management-section/management-section';
import { PerformanceSection } from '../sections/performance-section/performance-section';
import { IntroSection } from '../sections/intro-section/intro-section';

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
    ArticlePage,
    TabsPage,
    ValueSection,
    HealthSection,
    DividendSection,
    ManagementSection,
    PerformanceSection,
    IntroSection
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
    ArticlePage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    BrowserTab,
    Firebase,
    AngularFireDatabase,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
