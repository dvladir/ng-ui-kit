import {Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {SortField} from '../shared/sort-field';
import {Sort} from '../shared/sort.enum';

const DEF_SORT_VALUE: SortField = {field: '', sort: Sort.none};

@Injectable()
export class SortStateService implements OnDestroy {

  private _activeSort$: BehaviorSubject<SortField> = new BehaviorSubject<SortField>({...DEF_SORT_VALUE});

  get activeSort(): SortField {
    return this._activeSort$.value;
  }

  set activeSort(value: SortField) {
    if (value === this.activeSort) {
      return;
    }
    this._activeSort$.next(value);
  }

  get activeSort$(): Observable<SortField> {
    return this._activeSort$;
  }

  private _activeSortChange$: BehaviorSubject<SortField> = new BehaviorSubject<SortField>({...DEF_SORT_VALUE});

  get activeSortChange$(): Observable<SortField> {
    return this._activeSortChange$;
  }

  isImmediateUpdate: boolean = false;


  updateSort(sort: SortField): void {
    this._activeSortChange$.next(sort);
    if (this.isImmediateUpdate) {
      this.activeSort = sort;
    }
  }

  ngOnDestroy(): void {
    this._activeSort$.complete();
    this._activeSortChange$.complete();
  }
}
