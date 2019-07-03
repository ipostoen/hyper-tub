import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UserService, AuthService, ValidationService, NotifyService } from '@app/_services';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '@app/_models';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { faThumbsDown } from '@fortawesome/free-solid-svg-icons';

import { pick } from 'lodash';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  
  userId: any;
  user: User;
  infoForm: FormGroup;
  passwordForm: FormGroup;
  hide: boolean = true;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private auth: AuthService,
    private fb: FormBuilder,
    private notif: NotifyService
  ) {
    
  }

  ngOnInit() {
    this.infoForm = this.fb.group({
      firstName: ['', {validators: [Validators.required, Validators.minLength(3), Validators.maxLength(15)]}],
      lastName: ['', {validators: [Validators.required, Validators.minLength(3), Validators.maxLength(15)]}],
      username: ['', {validators: [Validators.required, Validators.minLength(3), Validators.maxLength(15)]}],
      email: ['', {validators: [Validators.required, ValidationService.email]}],
    });
    this.passwordForm = this.fb.group({
      oldPassword: ['', [ValidationService.password]],
      password: this.fb.group({
        password: ['', [ValidationService.password]],
        password2: ['']
      }, {validators: [ValidationService.childrenEqual]})
    })
    this.userId = this.route.snapshot.params['id'] || null;
    this.userService.$user.subscribe((user) => {
      if (user) {
        console.log('USER COMPONENT', user, "auth", this.auth.user);
        this.infoForm.patchValue(user);
        if (user._id === this.auth.user._id) this.hide = false;
        this.user = user;
        this.cdr.markForCheck();
      }
    })
    this.userService.getUserById(this.userId);
  }

  saveInfo() {
    if (!this.infoForm.valid) return ;

    this.userService.updateUserInfo(this.userId, this.infoForm.value)
    .then((res: User) => {
      if (res) {
        this.user = res;
      } else {
        this.infoForm.patchValue(this.user);
        this.notif.error('Something went wrong');
      }
      this.cdr.markForCheck();
    }).catch((error) => {
      console.log('ERROR', error);
      if (error.errCode === 11000) {
        this.infoForm.get(error.index).setErrors({duplicate: true});
        this.cdr.markForCheck();
      }
    })
  }

  changePassword() {
    if (!this.passwordForm.valid) return ;

    let data = {
      oldPassword: this.passwordForm.value.oldPassword,
      password: this.passwordForm.value.password.password
    }
    console.log('REQUEST DATA', data);
    
    this.userService.updateUserPassword(this.userId, data)
    .then((res) => {
      if (res) {
        this.notif.open('Password chang.');
        this.passwordForm.reset();
        this.cdr.markForCheck();
      }
    }).catch((error) => {
      if (error.errCode === 11999) {
        this.passwordForm.get('oldPassword').setErrors({childrenNotEqual: true});
        this.cdr.markForCheck();
      } else {
        this.notif.error(error);
      }
    })
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['']);
  }
}
