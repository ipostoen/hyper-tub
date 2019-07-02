import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler, APP_INITIALIZER } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthService, HttpService } from '@app/_services';

export function onAppInit(authService: AuthService) {
  console.log('APP init');
  
  return () => authService.load();
}

export class HorErrorHandler implements ErrorHandler {
  handleError(error) {
    console.debug(error.fileName);
    console.debug(error.lineNumber);
    console.debug(error.name, error.description);
    console.debug(error.stack);
  }
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    HttpService,
    AuthService,
    { provide: ErrorHandler, useClass: HorErrorHandler },
    { provide: APP_INITIALIZER, useFactory: onAppInit, multi: true, deps: [AuthService, HttpService] },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
