import { Component } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'frontend';
  display: boolean = true;
  constructor(
    private router: Router,
    private translate: TranslateService
  ) {
     translate.setDefaultLang('en');
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        if (event && (event.url.split('?')[0] === '/sign-in' || event.url.split('?')[0] === '/sign-up' || event.url.split('?')[0] === '/not-found')) this.display = false;
        else this.display = true;
      }
      
    });
  }
}
