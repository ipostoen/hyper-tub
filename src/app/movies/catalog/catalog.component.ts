import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MoviesService } from '@app/_services';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent implements OnInit {

  filters: FormGroup;
  ganresList = [];
  movies;

  constructor(
    private fb: FormBuilder,
    private movieService: MoviesService
  ) {
    this.movieService.getGanres()
    .then((ganres) => {
      console.log(ganres);
      if (ganres) this.ganresList = ganres['genres'];
    }).catch((err) => {
      console.log(err);
    });
    this.movieService.getMovieList();
    this.movieService.$movieList.subscribe((list) => {
      if (list) {
        list.map((val, i) => {
        val.genres = [];
        val.genre_ids.map((id, j) => {
          this.ganresList.filter((item) => {
            if (item.id === id) {
              val.genres[j] = item.name;
            }
          });
        })
      })
      this.movies = list;
      }
      
    })
    
    this.filters = this.fb.group({
      'ganres': [''],
      'page': ['1'],
      'primary_release_year': [''],
      'with_ganres': [''],
      'primary_release_date.gte': [''],
      'primary_release_date.lte': [''],
      'sort_by': ['']
    });
    this.filters.valueChanges.subscribe((val)=> {
      val = this.dropEmpty(val);
      console.log('NEW VA:|L', val)

    })

  }

  ngOnInit() {
  }

  dropEmpty(filters) {
    function deleteNullProperties(dirty) {
      for (var i in dirty) {
        if (dirty[i] === null || dirty[i] === '') {
          delete dirty[i];
        } else if (typeof dirty[i] === 'object') {
          deleteNullProperties(dirty[i]);
        }
      }
    }
    function deleteEmptyProperties(dirty) {
      for (var i in dirty) {
        if (typeof dirty[i] === 'object') {
          if (Object.keys(dirty[i]).length === 0) {
            delete dirty[i];
          } else {
            deleteEmptyProperties(dirty[i]);
          }
        }
      }
    }
    const dropNulls = (obj) => {
      let clean = Object.assign({}, obj);
      deleteNullProperties(clean);
      deleteEmptyProperties(clean);
      return clean;
    }
    let clonedFilters = dropNulls(filters);
    return clonedFilters;
  }

}
