import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { environment } from '@env'
import { BehaviorSubject, throwError, empty, of, Observable } from 'rxjs';
import { catchError, retry, timeout, tap, finalize, debounceTime, distinctUntilChanged } from 'rxjs/operators';


@Injectable()
export class HttpService {

  public apiProtocol: string = environment.apiProtocol;
  public apiHostname: string = environment.apiHostname;
  public apiPort: number = environment.apiPort;
  public apiPrefix: string = environment.apiPrefix;
  public apiTimeout: number = environment.apiTimeout;
  public apiUrl: string;
  private requestSubject: BehaviorSubject<string> = new BehaviorSubject(null);
  private errorSubject: BehaviorSubject<any> = new BehaviorSubject(null);
  
  constructor(
    private http: HttpClient
  ) {
    if (environment.production) {
      this.apiUrl = environment.apiUrl ? environment.apiUrl : `${this.apiProtocol}//${this.apiHostname}:${this.apiPort}/${this.apiPrefix}`;
    } else {
      if (!environment.apiUrl) {
        const url = new URL(window.location.href);
        if (url.port !== '') {
          this.apiUrl = `${url.protocol}//${url.hostname}:${environment.apiPort || url.port}/${this.apiPrefix}`;
        } else {
          this.apiUrl = `${url.protocol}//${url.host}/${this.apiPrefix}`;
        }
      } else {
        this.apiUrl = environment.apiUrl;
      }
    }
  }

  get $request() {
    return this.requestSubject.asObservable();
  }
  get $error() {
    return this.errorSubject.asObservable();
  }

  static setAuthHeader(token: string, headers?: HttpHeaders) {
    if (!headers) { headers = new HttpHeaders(); }
    return headers.set('x_auth', `${token}`);
  }

  'post'(url: string, data: object, options?: any): Observable<any> {
    this.requestSubject.next('Saving data');
    return this.http.post(this.apiUrl + url, data, options)
      .pipe(
        timeout(this.apiTimeout),
        catchError(this.handleError),
        finalize(() => this.endRequest())
      );
  }
  'postForm'(url: string, data: object, showLoader = false): Observable<any> {
    if (showLoader) {
      this.requestSubject.next('Saving data');
    }
    const formData = this.obj2formData(data);
    return this.http.post(this.apiUrl + url, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      catchError(this.handleError),
      finalize(() => this.endRequest())
    );
  }
  'get'(url: string, options?: any, requestTimeout: number = 25000): Observable<any> {
    return this.http.get(this.apiUrl + url, options)
      .pipe(
        timeout(requestTimeout || this.apiTimeout),
        catchError((error) => this.handleError(error)),
        finalize(() => this.endRequest())
      );
  }
  'put'(url: string, data: object, options?: any): Observable<any> {
    console.log('PUT');
    
    this.requestSubject.next('Updating data');
    return this.http.put(this.apiUrl + url, data, options)
      .pipe(
        timeout(this.apiTimeout),
        catchError(this.handleError),
        finalize(() => this.endRequest())
      );
  }
  'putForm'(url: string, data: object): Observable<any> {
    this.requestSubject.next('Updating data');
    const formData = this.obj2formData(data);
    return this.http.put(this.apiUrl + url, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      catchError(this.handleError),
      finalize(() => this.endRequest())
    );
  }
  'delete'(url: string,  options?: any,): Observable<any> {
    this.requestSubject.next('Deleting data');
    return this.http.delete(this.apiUrl + url, options)
      .pipe(
        timeout(this.apiTimeout),
        catchError(this.handleError),
        finalize(() => this.endRequest())
      );
  }

  private obj2formData(data: object) {
    const form = new FormData();
    Object.keys(data).forEach((name) => {
      if (typeof data[name] !== 'string') {
        if (data[name]) {
          if (data[name].type && data[name].type === 'upload') {
            data[name] = data[name].file;
          } else {
            data[name] = JSON.stringify(data[name]);
          }
        }
      }
      form.append(name, data[name]);
    });
    return form;
  }
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      let shouldThrow = true;
      if (!this.errorSubject) this.errorSubject = new BehaviorSubject(null);
      if (error.status === 0) {
        this.errorSubject.next(`Backend is down`);
      } else if (error.status === 400) {
        if (error.error && error.error.errCode === 11000) {
					if (error.error.index === 'email') error.error.statusText = 'Duplicate email';
					else if (error.error.index === 'username') error.error.statusText = 'Duplicate username';
				} else if (error.error && error.error.errCode === 11999) {
					error.error.statusText = 'oldPass incorect';
				} else if (error.error && error.error.errCode === 40010) {
					error.error.statusText = 'Username or password incorrect';
				} else if (error.error && error.error.errCode === 2001) {
					error.error.statusText = 'Please confirm your account';
				} else if (error.error === 'code') {
					error.error.statusText = 'Bad code';
        }
        return throwError(error.error);
      } else if (error.status === 404) {
        console.log(`404 Error was here`, error);
        shouldThrow = false;
        return of(false);
      } else if (error.status === 422) {
        this.errorSubject.next(error);
        // console.error('validation error', error);
      } else if (error.status === 401) {
        if (error.error === "TokenExpiredError") {
          console.error('Token expired');
          shouldThrow = false;
          return empty();
        } else {
          console.error('Auth', error);
          sessionStorage.removeItem('token');
          localStorage.removeItem('token');
          window.location.href = '/sign-in';
          throwError(error);
        }
      } else if (error.status === 500) {
        this.errorSubject.next(`Backend internal error`);
      } else {
        return throwError(error);
      //   console.log(error);
      //   // The backend returned an unsuccessful response code.
      //   // The response body may contain clues as to what went wrong,
      //   console.error(
      //     `Backend returned code ${error.status}, ` +
      //     `body was: ${error.error}`);
      }
      // return an observable with a user-facing error message
      if (shouldThrow) {
        return throwError(error);
      }
    }
  }
  private endRequest() {
    this.requestSubject.next(null);
  }
}