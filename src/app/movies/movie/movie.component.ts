import { Component, OnInit } from '@angular/core';
import * as Plyr from 'plyr';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.scss']
})
export class MovieComponent implements OnInit {

  public player;

  constructor() { }

  ngOnInit() {
    this.player = new Plyr('#playerId', { captions : { active: true } });
  }

}
