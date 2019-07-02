import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, throwError } from 'rxjs';
import { User } from '@app/_models';
import { tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private redirectUrl: string;
  private $userSubject: BehaviorSubject<User> = new BehaviorSubject(null);
  private $accessTokenSubject: BehaviorSubject<string> = new BehaviorSubject(null);

  constructor(
    private http: HttpService,
    private client: HttpClient
  ) {
    this.redirect;
    this.$accessTokenSubject.subscribe((token) => {
      if (token) {
        this.saveToken(token);
        if (!this.user) {
          this.getUserInfo(token).subscribe((response) => {
            console.debug('My USER:', response);
          }, (error) => {
            return throwError(error);
          });
        }
      }
    })
  }

  load(fromInterceptop?) {
    return new Promise((resolve, reject) => {
      let token = window.sessionStorage.getItem(`token`) || window.localStorage.getItem(`token`);
      if (token) {
        this.$accessTokenSubject.next(token);
        return resolve(true)
      } else {
        this.$accessTokenSubject.next(null);
        return reject();
      }
    });
  }

  get redirect() {
    if (!this.redirectUrl) this.redirectUrl = window.sessionStorage.getItem('redirect');
    if (!this.redirectUrl) this.redirectUrl = '/home';
    return this.redirectUrl;
  }
  set redirect(url: string) {
    if (url !== '/sign-in') {
      this.redirectUrl = url;
      // if (window.sessionStorage) 
      window.sessionStorage.setItem('redirect', this.redirectUrl);
    } else {
      window.sessionStorage.removeItem('redirect');
    }
  }
  get $user() {
    return this.$userSubject.asObservable();
  }
  get user() {
    return this.$userSubject.getValue();
  }
  public saveToken(token: string, session?: boolean) {
    if (session) return localStorage.setItem('token', token);
    else return sessionStorage.setItem('token', token);
  }
  public clearStorage(uuid = false) {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('redirect');
  }
  private getUserInfo(token?) {
    return this.http.get('/me', {
      headers: new HttpHeaders({
        'x-auth': token,
      })
    }).pipe(tap(user => this.$userSubject.next(user)));
  }
}