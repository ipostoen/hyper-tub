import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements OnInit {

  min: number = 0;
  max: number = 100;
  _type: string = 'text';
  readonly: boolean = false;
  autocomplete: boolean = false;
  inputmode: boolean = false;
  _control: FormControl;

  @Input() placeholder: string;
  @Input() value;
  @Input()
  set type(type) {
    if (type) this._type = type;
  }
  @Input()
  set control(control: FormControl) {
    this._control = control;
  }
  constructor() { }

  ngOnInit() {
  }

}
