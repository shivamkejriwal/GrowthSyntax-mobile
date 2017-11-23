import { Component } from '@angular/core';

import { AboutPage } from '../about/about';
import { GuidePage } from '../guide/guide';
import { MarketPage } from '../market/market';
import { CommentaryPage } from '../commentary/commentary';
import { VideosPage } from '../videos/videos';
import { LoginPage } from '../login/login';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = MarketPage;
  tab2Root = CommentaryPage;
  tab3Root = VideosPage;
  tab4Root = GuidePage;
  tab5Root = AboutPage;
  tab6Root = LoginPage;
  

  constructor() {

  }
}
