import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler, APP_INITIALIZER } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthService, HttpService } from '@app/_services';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthModule } from './auth/auth.module';
import { SharedModule } from './shared/shared.module';
import { MainModule } from './main/main.module';
import { UserModule } from './user/user.module';
import { MoviesModule } from './movies/movies.module';

import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HttpClient, HttpClientModule} from '@angular/common/http';

export function onAppInit(authService: AuthService) {
  console.log('APP init');
  
  return () => authService.load();
}

export class HorErrorHandler implements ErrorHandler {
  handleError(error) {
    if (error) {
      console.debug(error.fileName);
      console.debug(error.lineNumber);
      console.debug(error.name, error.description);
      console.debug(error.stack);
    }
  }
}

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AuthModule,
    SharedModule,
    MainModule,
    UserModule,
<<<<<<< HEAD
    TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        })
=======
    MoviesModule
>>>>>>> 250cdd57fab22b4fb9309adfe980a3e28a86072b
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

