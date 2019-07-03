import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { NotifyService } from './notification.service';
import { HttpService } from './http.service';
import { AuthService } from './auth.service';


@Injectable({ providedIn: 'root' })
export class ApiService {

  constructor(
    private auth: AuthService,
    private http: HttpService,
    private notify: NotifyService
  ) { }


  getUserById(userId) {
    return new Promise((resolve, reject) => {
      this.http.get(`/user/${userId}`, { observe: 'response', headers: HttpService.setAuthHeader(this.auth.token) })
        .subscribe((res) => {
          if (res.body) {
            return resolve(res.body);
          } else {
            this.notify.error('User not found')
            throw new Error('User not found');
          }
        }, error => {
          reject(error);
        });
    });
  }

  updateUserInfo(userId, data) {
    return new Promise((resolve, reject) => {
      this.http.put(`/user/${userId}`, data, { observe: 'response', headers: HttpService.setAuthHeader(this.auth.token) })
      .subscribe((res) => {
        console.log('UPDATE USER INFO RESPONSE', res);
      });
    })
  }
}