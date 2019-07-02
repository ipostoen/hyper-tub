import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './button/button.component';
import { MaterialModule } from './material.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { InputComponent } from './input/input.component';
import { InputErrorComponent } from './input-error/input-error.component';

@NgModule({
  declarations: [
    ButtonComponent,
    InputComponent,
    InputErrorComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FontAwesomeModule
  ],
  exports: [
    InputErrorComponent,
    ButtonComponent,
    InputComponent,
    MaterialModule,
    FontAwesomeModule
  ]
})
export class SharedModule { }
