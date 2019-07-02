import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ValidationService } from '@app/_services';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'

@Component({
  selector: 'app-input-error',
  templateUrl: './input-error.component.html',
  styleUrls: ['./input-error.component.scss']
})
export class InputErrorComponent implements OnInit {

  faInfoCircle = faInfoCircle;
  @Input() label;
  @Input() control: FormControl;
  constructor() { }

  ngOnInit() {
  }
  get errorMessage(): string {
    for (const errorName in this.control.errors) {
      if (this.control.errors.hasOwnProperty(errorName)) {
        let message = ValidationService.getErrorMessage(errorName, this.label, this.control.errors[errorName]);
        if (!message) { message = this.control.errors[errorName]; }
        return message;
      }
    }
    return null;
  }
}
