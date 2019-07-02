import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { AboutComponent } from './main/about/about.component';
import { NotFoundComponent } from './main/not-found/not-found.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home'
  },
  {
    path: 'home',
    pathMatch: 'full',
    component: AboutComponent
  },
  {
    path: 'sign-in',
    pathMatch: 'full',
    component: SignInComponent
  },
  {
    path: 'sign-up',
    pathMatch: 'full',
    component: SignUpComponent
  },
  {
    path: 'not-found',
    pathMatch: 'full',
    component: NotFoundComponent
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'not-found'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
