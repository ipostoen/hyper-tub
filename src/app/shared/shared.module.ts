import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './button/button.component';
import { MaterialModule } from './material.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { InputComponent } from './input/input.component';
import { InputErrorComponent } from './input-error/input-error.component';
import { VideoPlayerComponent } from './video-player/video-player.component';

@NgModule({
  declarations: [
    ButtonComponent,
    InputComponent,
    InputErrorComponent,
    VideoPlayerComponent,
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
    FontAwesomeModule,
    VideoPlayerComponent
  ]
})
export class SharedModule { }
