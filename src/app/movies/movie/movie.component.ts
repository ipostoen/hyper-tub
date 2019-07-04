import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MoviesService, AuthService } from '@app/_services';



@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.scss']
})
export class MovieComponent implements OnInit {

  public id;
  public movie;
  public videos = [];
  public subtitles = [];
  public player;
  objectKeys = Object.keys;
  commentsForm: FormGroup

  // @ViewChild('video', {static: false}) video: ElementRef; 
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private moviesService: MoviesService,
    private auth: AuthService,
    private cdr: ChangeDetectorRef
  ) {
    // this.id = this.route.snapshot.params['id'] || null;
    this.route.params.subscribe((params) => {
      console.log('ROUTER', params);
      if (params.id && params.id !== this.id) {
        this.id = params.id;
        this.videos = []
        this.subtitles = [];
        this.moviesService.getMovieById(this.id)
          .then((movie) => {
            if (movie) {
              console.log('Movie', movie);
              
              this.movie = movie;
              Object.keys(movie['torrents']['en']).forEach((key, i) => {
                this.videos.push({
                  link: this.getStreamUrl(key),
                  size: key.slice(0, -1)
                })
              });
              Object.keys(movie['subtitle']).forEach((key, i) => {
                this.subtitles.push({
                  local: movie['subtitle'][key]['local'],
                  file: movie['subtitle'][key]['file'],
                  lable: movie['subtitle'][key]['lable'],
                })
              });
              console.log('vidd', this.videos);
              
              this.cdr.markForCheck();
            } else {
              this.router.navigate(['movies']);
            }
          }).catch((err) => {
            console.log('err', err)
            this.router.navigate(['movies']);
          })
      }
    })
    if (!this.id) {
      this.router.navigate(['movies']);
    }
  }

  ngOnInit() {
    // this.moviesService.getComment(this.id)
    
    this.commentsForm = this.fb.group({
      comment: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(1000)
      ]]
    });
  }

  get poster() {
    return `http://image.tmdb.org/t/p/original${this.movie.poster_path}`;
  }

  get date() {
    let date: String;
    if (this.movie) {
      date = this.movie.release_date.split('-')[0];
    }
    return date;
  }

  getStreamUrl(quality) {
    console.log(this.movie, quality);
    
    return `http://localhost:3000/api/movie/stream/${encodeURIComponent(this.movie.torrents.en[quality].url)}?` +
      `x_auth=${this.auth.token}&-${quality}`;
  }

  sendComment() {
    if (!this.commentsForm.valid) return ;
      this.moviesService.sendComment(this.commentsForm.value, this.id)
    .then((res) => {

    }).catch((err) => {

    })
  }

  deleteComment() {
    this.moviesService.deleteComment(this.id)
    .then((res) => {

    }).catch((err) => {
      console.log(err);
    })
  }

}
