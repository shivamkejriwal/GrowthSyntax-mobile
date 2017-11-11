import { Component } from '@angular/core';

import { AboutPage } from '../about/about';
import { GuidePage } from '../guide/guide';
import { MarketPage } from '../market/market';
import { CommentaryPage } from '../commentary/commentary';


@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = MarketPage;
  tab2Root = CommentaryPage;
  tab3Root = GuidePage;
  tab4Root = AboutPage;

  constructor() {

  }
}
