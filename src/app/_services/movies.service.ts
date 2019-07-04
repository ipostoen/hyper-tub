import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { ReturnStatement } from '@angular/compiler';
import { HttpService } from './http.service';
import { AuthService } from './auth.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MoviesService {

  private movieListObs: BehaviorSubject<any> = new BehaviorSubject(null);

  page = 1;

  constructor(
    private http: HttpService,
    private auth: AuthService
  ) {
  }

  get $movieList() {
    return this.movieListObs.asObservable();
  }
  getMovieList() {

      this.http.get('/movie/list', {
        observe: 'response',
        headers: HttpService.setAuthHeader(this.auth.token)
      }).subscribe((res) => {
        console.log('RESPONSE ', res);
        this.page = res.body.page;
        this.movieListObs.next(res.body.results);
      }, (err) => {
        // return (err);
      });
  }

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
      this.http.post(`/comment`, { comment, filmId }, {
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
      this.http.get(`/comment/${id}`, {
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
      this.http.delete(`/comment/${id}`, {
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

  getGanres() {
    return new Promise((resolve, reject) => {
      this.http.get('/movie/ganres', {observe: 'response', headers: HttpService.setAuthHeader(this.auth.token)})
      .subscribe((data) => {
        // console.log('GERAS', data);
        return resolve(data.body);
      }, (err) => {
        return reject(err);
      })
    });
  }


}