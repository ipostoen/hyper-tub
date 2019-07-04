import { Component, OnInit, Input, EventEmitter, Output, ChangeDetectionStrategy } from '@angular/core';
import { px2rem } from '@app/_services/utils';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-input-element',
  templateUrl: './input-element.component.html',
  styleUrls: ['./input-element.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputElementComponent implements OnInit {
  content = {
    type: null,
    text: null,
    pl: '0',
    pr: '0'
  };
  clearButton = false;
  faCaretDown = faCaretDown;
  @Output() action = new EventEmitter();
  @Input() set element(value: any){
    if (typeof value === "string") {
      this.content.type = value;
      // this.clearButton = true;
    } else {
      this.content = Object.assign(this.content, value);
      if (value['pl']) this.content['pl'] = px2rem(value['pl']);
      if (value['pr']) this.content['pr'] = px2rem(value['pr']);
    }

    // if (value === 'clearButton') {
    // } else {
      // this.content = value;
    // }
    // this.content = el;
  }

  constructor() { }

  ngOnInit() {
  }


}
