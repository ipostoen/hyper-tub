import { Injectable } from '@angular/core';
import { ValidatorFn, FormGroup, FormControl } from '@angular/forms';

@Injectable()
export class ValidationService {

  constructor() { }

  static getErrorMessage(errorName: string, errorLabel?: string, errorValue?: any) {
    if (errorName) {
      const errors = {
        'token': `Invalid token`,
        'email': `Not a valid email`,
        'unknown': `${errorLabel} not found`,
        'required': `${errorLabel} is required`,
        'passwordReg': `${errorLabel} must have 7 chars, 1 uppercase alphabet and 1 number`,
        'minlength': `${errorLabel} length must be at least ${errorValue.requiredLength} characters long`,
        'duplicate': `${errorLabel} already exist`,
        'childrenNotEqual': `Passwords do not match`
      };
      if (errorName === 'pattern') {
        if (errorValue.requiredPattern === '^[a-zA-Z,\'\`]{2,}$') {
          errors[errorName] = `${errorLabel} should have at least 2 alphabet characters`;
        } else if (errorValue.requiredPattern === '^[a-zA-Z,\',`]{2,}$') {
          errors[errorName] = `${errorLabel} should have at least 2 alphabet characters`;
        }
      }
      return errors[errorName];
    }
  }
  static childrenEqual: ValidatorFn = (formGroup: FormGroup) => {
    const [firstControlName, ...otherControlNames] = Object.keys(formGroup.controls || {});
    const isValid = otherControlNames.every(controlName => formGroup.get(controlName).value === formGroup.get(firstControlName).value);
    return isValid ? null : { childrenNotEqual: true};
  }
  static password: ValidatorFn = (formControl: FormControl) => {
    let regex = new RegExp(/^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=[^0-9]*[0-9]).{7,}$/, 'gm');
    return regex.test(formControl.value) ? null : { passwordReg: true };
  }
  static email: ValidatorFn = (formControl: FormControl) => {
    let regex = new RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z_]+?\.[a-zA-Z]{2,99}$/, 'gm');
    return regex.test(formControl.value) ? null : { email: true };
  }
}
