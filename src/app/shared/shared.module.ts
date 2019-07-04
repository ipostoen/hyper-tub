import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './button/button.component';
import { MaterialModule } from './material.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { InputComponent } from './input/input.component';
import { InputErrorComponent } from './input-error/input-error.component';
import { VideoPlayerComponent } from './video-player/video-player.component';

import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import { DropdownSelectComponent } from './dropdown-select/dropdown-select.component';
import { InputPlaceholderComponent } from './input-placeholder/input-placeholder.component';
import { InputElementComponent } from './input-element/input-element.component';

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    ButtonComponent,
    InputComponent,
    InputErrorComponent,
    VideoPlayerComponent,
    DropdownSelectComponent,
    InputPlaceholderComponent,
    InputElementComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FontAwesomeModule,
    TranslateModule.forRoot({
        loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
        }
    }),
  ],
  exports: [
    InputErrorComponent,
    ButtonComponent,
    InputComponent,
    MaterialModule,
    FontAwesomeModule,
    VideoPlayerComponent,
    DropdownSelectComponent,
    InputElementComponent
  ]
})
export class SharedModule { }
