import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewChild, ElementRef, ChangeDetectorRef, ViewEncapsulation, forwardRef, AfterViewInit, AfterViewChecked } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { UP_ARROW, DOWN_ARROW, SPACE, ENTER, ESCAPE} from '@angular/cdk/keycodes';
import { isArray, isPlainObject, isString, intersection } from 'lodash';
import {CdkConnectedOverlay, Overlay, ScrollStrategy} from '@angular/cdk/overlay';
import {ViewportRuler} from '@angular/cdk/scrolling';

import {
  distinctUntilChanged,
  filter,
  map,
  startWith,
  switchMap,
  take,
  takeUntil,
} from 'rxjs/operators';
import { ActiveDescendantKeyManager } from '@angular/cdk/a11y';
import { Popup } from '@app/_services/popup.service';

export const DROPDOWN_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DropdownSelectComponent),
  multi: true
}


@Component({
  selector: 'app-dropdown-select',
  templateUrl: './dropdown-select.component.html',
  providers: [DROPDOWN_VALUE_ACCESSOR],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    // '(keydown)': '_handleKeydown($event)',onChang
    '(focus)': 'showPopup()',
    '(click)': 'showPopup()',
    '(blur)': '_onTouched()'
  }
})
export class DropdownSelectComponent implements OnInit, ControlValueAccessor {
  _options = [];
  _multiple = false;
  _selected;
  _required = false;
  _checkboxes = false;
  _allRow = false;
  _sm: SelectionModel<any>;
  _ref;
  _mode: 'search' | 'select' = 'select';
  _value = null;
  _form;
  _controlName;
  enabled = true;
  @Input() readonly: boolean;
  @Input() type = "text";
  @Input() panelClass = 'dropdown-overlay';
  @Input() liveupdates = false;
  @Input() formControl;
  @Input() closeOnSelect = false;
  @Input() set formControlName(name: any) {
    this._controlName = name;
    if (this._form && !this.formControl) {
      this.formControl = this.form.get(this._controlName);
    }
  }
  @Input() set form(form: any) {
    this._form = form;
    if (this._controlName) {
      this.formControl = this._form.get(this._controlName);
    }
  }
  @Input() set required(value: boolean) {
    this._required = value;
  }
  @Output() clear = new EventEmitter();
  onChange: Function;
  onTouched: Function;
  currentValue: any;
  initialValue: any;
  _onTouched() {
    this.onTouched()
  }
  _onChange(value) {
    // console.log(this.currentValue, value);
    // if (this.currentValue !== value) {
      // if (value === null) this.clear.emit(this._controlName);
      this.onChange(value);
    // }
  }
  setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) this.enabled = false;
    else this.enabled = true;
  }
  registerOnTouched(fn: any): void {
      this.onTouched = fn;
  }
  registerOnChange(fn: any): void {
      this.onChange = fn;
  }
  writeValue(value: any): void {
    if (value) {
      const setInitialValue = (value, timeout = 10) => {
        if (this.onChange) {
          if (!this._required) {
            this.postfix = {type: 'clearButton'};
          }
          this._sm.select(value);
          this.setValue(value);
          this.cdr.markForCheck();
          this.onChange(value)
        } else {
          this.initialValue = value;
          setTimeout(() => {
            setInitialValue(value, timeout);
          }, timeout);
        }
      }
      setInitialValue(value, 20)
    } else if (value === null) {
      this.postfix = {type: 'dropdown'}
      this.clearAll();
      this.cdr.markForCheck()
    }
  }
  get showClearButton() {
    if (this.postfix && this.postfix.type === 'clearButton') {
      return true;
    }
    return false;
  }
  set showClearButton(show: boolean) {
    if (show && !this._required)  this.postfix = {type: 'clearButton'};
    else this.postfix = {type: 'dropdown'}
  }


  @ViewChild('list', {static: true}) list;
  @ViewChild('holder', {read: ElementRef, static: true}) holder;
  @Input() postfix;
  @Input() icon;
  @Input() prefix;
  @Input() text;
  @Input()
  set mode(value: 'search' | 'select') {
    if (value) this._mode = value;
  }
  @Input()
  set allRow(value: boolean) {
    this._allRow = value;
  }
  @Input() placeholder;
  @Input()
  set checkboxes(value: boolean) {
    this._checkboxes = value;
  }
  @Input()
  set options(opts: []) {
    console.log('Input', opts);
    
    if (opts) {
      this._options = opts;
    } else {
      this._options = [];
    }
    this.cdr.markForCheck();
  }
  @Input()
  set multiple(allow: boolean) {
    this._multiple = allow;
  }
  constructor(private popup: Popup, private cdr: ChangeDetectorRef) {
  }
  ngOnInit() {
    if (this.formControl && this.formControl.value) {
      this._sm = new SelectionModel(this._multiple, this.formControl.value);
      this.showClearButton = true;
    } else {
      this._sm = new SelectionModel(this._multiple);
    }
    // console.log(this.formControl.root);
    this.formControl.valueChanges.subscribe((value) => {
      this.currentValue = value;
    })
    if (this.formControl.updateOn === 'submit') {
      this.formControl.root.statusChanges.subscribe((status) => {
        if (status !== 'DISABLED') {
          if (this.currentValue) {
            this._onChange(this.currentValue);
            this.setValue(this.currentValue);
          }
          this.cdr.markForCheck();
        }
      })
    }
    this._sm.changed.subscribe(change => {
      if (this._mode === 'search') {
        if (change.source.isEmpty()) {
          this._onChange(null);
        } else {
          this._onChange(change.added[0]);
        }
      } else if (this._mode === 'select') {
        if (change.source.isMultipleSelection()) {
            if (change.source.isEmpty()) {
              this._onChange(null);
            } else {
              if (this._onChange) {
                this._onChange(change.source.selected.slice());
              }

            }
        } else {
          if (change.source.isEmpty()) {
            this._onChange(null);
          } else {
            this._onChange(change.added[0]);
          }
        }
        if (this.liveupdates === true && this.onTouched) this._onTouched();
      } else {
        console.log('unknown mode', this._mode, change);
      }
    //
    this.setValue(this._sm.selected);

    });
  }

  select(value) {
    this._sm.select(value);
    if (this._multiple !== true && this._mode === 'select' && this.closeOnSelect === true) {
      if (this._ref) {
        this._ref.close(true);
      }
    }
  }


  isSelected(value) {
    let selected = this._sm.selected.find(option => option.id === value.id);
    return selected;
  }

  isEmpty() {
    return this._sm.isEmpty();
  }

  clearAll() {
    this._sm.clear();
    this.setValue(this._sm.selected);
    this.cdr.markForCheck();
    return;
  }
  onClear(event) {
    this.clearAll();
    if (this._ref) {
      this._ref.close(true);
    }
  }
  onClick(option) {
    if (this._mode === 'select') {
      if (this._multiple) {
        this._sm.toggle(option);
      } else {
        if (this.isSelected(option)) {
          if (this._required !== true) {
            this.clearAll();
          }
        } else {
          this.select(option);
        }
      }
    } else if (this._mode === 'search') {
      this._onChange(option);
    }
  }

  toggle(value) {
    if (this._mode === 'select') {
      if (Array.isArray(value)) {
        this._sm.toggle(value);
      } else {
        let isIn = this._sm.selected.find((sel) => sel.id === value.id && sel.name === value.name);
        if (isIn) {
          this._sm.deselect(isIn);
        } else {
          this._sm.select(value);
        }
      }
      this.setValue(this._sm.selected);
      this._onTouched();
      this.cdr.markForCheck()
    } else if (this._mode === 'search') {
      this._ref.close(value);
    }
  }
  setValue(selected) {
    if (Array.isArray(selected)) {
      if (selected.length > 0) {
        this._value = selected.map(option => option.name).join(', ');
      } else {
        this._value = '';
      }
    } else {
      this._value = selected.title;
    }
    if (this._value === null || this._value === '') {
      this.postfix = {type: 'dropdown'}
      this.showClearButton = false;
    } else {
      if (!this._required){
        this.postfix = {type: 'clearButton'};
      }
      this.showClearButton = true;
    }
    this.cdr.markForCheck();
  }
  showPopup() {
    if (!this.readonly && this.enabled && this._options && this._options.length > 0) {
      this._ref = this.popup.open({
        origin: this.holder,
        content: this.list,
        panelClass: this.panelClass
      });
      this._ref.afterClosed$.subscribe(res => {
        if (this.formControl){
          if (this.formControl.updateOn === 'blur') {
            this._onTouched();
              this.setValue(this._sm.selected);
              this.cdr.markForCheck()
          }
        }
      });
    } else {
      console.log('Input disabled or no options provided')
    }
  }
}
