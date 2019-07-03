import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '@app/_models';
import { ApiService } from './api.service';
import { first } from 'rxjs/operators';
import { resolve } from 'url';
import { HttpService } from './http.service';
import { AuthService } from './auth.service';

@Injectable({providedIn: 'root'})
export class UserService {

  private UserSubject: BehaviorSubject<User> = new BehaviorSubject(null);
  public $user = this.UserSubject.asObservable();

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private http: HttpService
  ) {}

  getUserById(id) {
    this.api.getUserById(id)
    .then((user: User) => {
      if (user) this.UserSubject.next(user);
    }).catch((error) => {
      console.log('Error', error)
    })
  }

  updateUserInfo(userId, data) {
    return new Promise((resolve, reject) => {
      this.http.put(`/user/${userId}`, data, { observe: 'response', headers: HttpService.setAuthHeader(this.auth.token) })
      .subscribe((res) => {
        return resolve(res.body);
      }, (err) => {
        return reject(err);
      });
    })
  }

  updateUserPassword(userId, data) {
    return new Promise((resolve, reject) => {
      this.http.put(`/user/password/${userId}`, data, { observe: 'response', headers: HttpService.setAuthHeader(this.auth.token) })
      .subscribe((res) => {
        console.log('RESPONSE', res);
        return resolve(res.body);
      }, (err) => {
        console.log('ERROR', err);
        return reject(err);
      });
    })
  }
}