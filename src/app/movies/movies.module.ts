import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatalogComponent } from './catalog/catalog.component';
import { MovieComponent } from './movie/movie.component';

@NgModule({
  declarations: [
    CatalogComponent, 
    MovieComponent
  ],
  imports: [
    CommonModule,
  ],
  exports: [
  ]
})
export class MoviesModule { }
