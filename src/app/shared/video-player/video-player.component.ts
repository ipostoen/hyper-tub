import { Component, OnInit, Input, OnChanges } from '@angular/core';

import * as Plyr from 'plyr';


@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss']
})
export class VideoPlayerComponent implements OnChanges {

  public videos = [];
  public subtitles = [];
  public player;

  @Input() 
  set vid(v) {
    console.log('vvvv', v);
    
    this.videos = v;
  }
  @Input()
  set title(t) {
    if (t) this.subtitles = t;
  }
  constructor() { }

  ngOnInit() {
  }
  ngOnChanges() {
    console.log('aaaa');
    
  }
  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.player = new Plyr('#playerId', { captions: { active: true } });
    
  }

}
