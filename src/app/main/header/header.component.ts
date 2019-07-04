import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public openSearch : boolean = false;
  public openMenu : boolean = false;
	@Output() changeLeng: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  sendEvent() {
  	this.changeLeng.emit();
  }

  sendMenu() {
    this.changeLeng.emit();
  }

  searchFilm(){
    console.log('test123');
  }

}
