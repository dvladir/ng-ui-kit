import {Component, Host, OnInit} from '@angular/core';
import {CdkColumnDef} from '@angular/cdk/table';
import {Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';
import {SortStateService} from '../../services/sort-state.service';
import {Sort} from '../../shared/sort.enum';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'th[dvSortable]',
  templateUrl: './sortable.component.html',
  styleUrls: ['./sortable.component.scss']
})
export class SortableComponent implements OnInit {

  constructor(
    @Host() private _colDef: CdkColumnDef,
    private _sortState: SortStateService
  ) {
  }

  readonly Sort: typeof Sort = Sort;

  sort$: Observable<Sort> = of(Sort.none);

  changeSort(currentSort: Sort): void {
    const {name} = this._colDef;
    const newSort = currentSort !== Sort.asc ? Sort.asc : Sort.desc;
    this._sortState.update({field: name, sort: newSort});
  }

  ngOnInit(): void {
    const {name} = this._colDef;
    this.sort$ = this._sortState.value$
      .pipe(
        map(x => {
          if (x.field === name) {
            return x.sort;
          }
          return Sort.none;
        })
      );
  }

}
