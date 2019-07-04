import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { ReturnStatement } from '@angular/compiler';
import { HttpService } from './http.service';
import { AuthService } from './auth.service';
import { resolve } from 'dns';
import { reject } from 'q';

@Injectable({ providedIn: 'root' })
export class MoviesService {

  constructor(
    private http: HttpService,
    private auth: AuthService
  ) { }

  getMovieById(id, lang = 'en') {
    return new Promise((resolve, reject) => {
      this.http.get(`/movie`, {
        params: {id, lang},
        observe: 'response',
        headers: HttpService.setAuthHeader(this.auth.token)
      }).subscribe((data) => {
        return resolve(data.body);
      }, (error) => {
        console.log('RESPONSE EROR', error)
        return reject(error);
      });
    });
  }

  sendComment(comment: String, filmId: String) {
    return new Promise((resolve, reject) => {
      this.http.post(`http://localhost:3000/api/comment/${filmId}`, { comment, filmId }, {
        observe: 'response',
        headers: HttpService.setAuthHeader(this.auth.token)
      }).subscribe((data) => {
        return resolve(data.body);
      }, (error) => {
        console.log('RESPONSE EROR', error)
        return reject(error);
      });
    });
  }

  getComment(id) {
    return new Promise((resolve, reject) => {
      this.http.get(`http://localhost:3000/api/comment/${id}`, {
        observe: 'response',
        headers: HttpService.setAuthHeader(this.auth.token)
      }).subscribe((data) => {
        return resolve(data.body);
      }, (error) => {
        console.log('RESPONSE EROR', error)
        return reject(error);
      });
    });
  }

  deleteComment(id) {
    return new Promise((resolve, reject) => {
      this.http.delete(`http://localhost:3000/api/comment/${id}`, {
        observe: 'response',
        headers: HttpService.setAuthHeader(this.auth.token)
      }).subscribe((data) => {
        return resolve(data.body);
      }, (error) => {
        console.log('RESPONSE EROR', error)
        return reject(error);
      });
    })
  }


}