import { Component, OnInit, NgZone } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NotifyService, AuthService } from '@app/_services';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  form: FormGroup;
  returnUrl: string;
  remember: boolean = false;
  
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private notif: NotifyService,
    private router: Router,
    private route: ActivatedRoute,
    private ngZone: NgZone
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      username: [''],
      password: ['']
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.auth.logout();
  }

  navigate() {
    this.ngZone.run(() => this.router.navigate([this.returnUrl]));
  }

  signIn() {
    this.auth.login(this.form.value, this.remember)
    .then((user) => {
      this.notif.success(`Welcome, ${user['username']}`)
      this.navigate();
    }).catch((error) => {
      console.debug('Error', error);
      this.notif.error(error.statusText);
    })
  }

}
