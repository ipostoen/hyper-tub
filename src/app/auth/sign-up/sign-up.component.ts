import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ValidationService, NotifyService, AuthService } from '@app/_services';
import { Router } from '@angular/router';


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  form: FormGroup;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private notif: NotifyService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      firstName: ['', {validators: [Validators.required, Validators.minLength(3), Validators.maxLength(15)]}],
      lastName: ['', {validators: [Validators.required, Validators.minLength(3), Validators.maxLength(15)]}],
      username: ['', {validators: [Validators.required, Validators.minLength(3), Validators.maxLength(15)]}],
      email: ['', {validators: [Validators.required, ValidationService.email]}],
      password: this.fb.group({
        password: ['', [ValidationService.password]],
        password2: ['']
      }, {validators: [ValidationService.childrenEqual]})
    });
  }

  signUp() {
    if (!this.form.valid) return ;
    
    let newUser = this.form.value;
    newUser.password = newUser.password.password;
    this.authService.signup(newUser)
    .then((res) => {
      if (res && res['code'] === 200) {
        this.notif.success('Register success. Please confirm your email.');
        this.router.navigate(['/sign-in']);
      }
    })
    .catch((error) => {
      console.log('ERROR', error);
      if (error.errCode === 11000) {
        this.form.get(error.index).setErrors({duplicate: true});
        this.cdr.markForCheck();
      }
    })
    // this.authService.registerNewUser(newUser)
    // .pipe(first())
    // .subscribe((data) => {
    //   if (data && data['code'] === 200) {
    //     this.notif.success('Register success. Please confirm your email.');
    //     this.router.navigate(['/sign-in']);
    //   }
    // }, (error) => {
    //   console.log(error);
    //   if (error.errCode === 11000) {
    //     this.form.get(error.index).setErrors({duplicate: true});
    //     this.cdr.markForCheck();
    //   }
    // });
  }
}
