import { Component, OnInit, Input, ElementRef, Renderer2, forwardRef, ChangeDetectionStrategy, ViewChild, AfterViewInit, Output, EventEmitter, TemplateRef, ChangeDetectorRef, OnChanges } from '@angular/core';
// import { FormControl, FormControlName, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
// export const PLACEHOLDER_VALUE_ACCESSOR: any = {
//   provide: NG_VALUE_ACCESSOR,
//   useExisting: forwardRef(() => InputPlaceholderComponent),
//   multi: true
// }
@Component({
  selector: 'app-input-placeholder',
  templateUrl: './input-placeholder.component.html',
  styleUrls: ['./input-placeholder.component.scss'],
  // providers: [PLACEHOLDER_VALUE_ACCESSOR],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputPlaceholderComponent implements OnInit {
  onChange: Function;
  onTouched: Function;
  @Input() focus;
  // @Input() formControl;
  // @Input() readOnly;
  _value = null;
  showClearButton = true;
  initPostfix;
  @Input() type: string;
  @Input() placeholder: string = null;
  @Input() set value(value: any) {
    this._value = value;
  }
  @Input() prefix;
  _postfix;
  @Input() set postfix(value: any){
    if (typeof value === "string") {
      value = {
        'type': value
      };
    }
    this._postfix = value;
    this.cdr.markForCheck();
  }
  @Output() onFocus = new EventEmitter();
  @Output() onBlur = new EventEmitter();
  @Output() onClear = new EventEmitter();
  @ViewChild('input', {static: true}) input: ElementRef;
  constructor(private renderer: Renderer2, private cdr: ChangeDetectorRef) {
  // //   // console.log(this.holder)
  }
  ngAfterViewInit(): void {
    this.checkClearButton()
    if (this.focus) {
      this.focus.subscribe((event) => {
      });

    }
  }
  ngOnInit() {
    this.initPostfix = this._postfix;
    // if (this.postfix === 'clearButton') {
    //   this.checkClearButton();
    // }
  }
  checkClearButton() {
    if (this._postfix) {
      if (this.input && this.input.nativeElement && this.input.nativeElement.value.length === 0) {
        if (this._postfix.type === 'clearButton') {
          // this.showClearButton = false;
        } else if (this._postfix.type === 'dropdown') {
          // console.log('droptype')
        }
      }
    }
    this.cdr.markForCheck()
  }

  onAction(action) {
    if (action === 'clear') {
      this.input.nativeElement.value = '';
      if (this._postfix && this.initPostfix) {
        if (this._postfix.type === 'clearButton' && this.initPostfix.type !== 'clearButton') {
          this._postfix = Object.assign({}, this.initPostfix);
        }
      }
      this.checkClearButton();
      this.onClear.emit(true);
      // this.showClearButton = false;
    }
  }
  onClick(target, event) {
    // console.log(target, event);
    // this.focus();
  }
  onInput(event) {
    this.checkClearButton()
  }
}
