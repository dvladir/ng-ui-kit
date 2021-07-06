import {Injectable} from '@angular/core';
import {SortStateService} from './sort-state.service';
import {BehaviorSubject} from 'rxjs';
import {Sort} from '../shared/sort.enum';
import {SortField} from '../shared/sort-field';

@Injectable()
export class SortStateMockService implements Partial<SortStateService> {
  value$: BehaviorSubject<SortField> = new BehaviorSubject<SortField>({field: '', sort: Sort.none});
  update(value: SortField): void {
    this.value$.next(value);
  }
}
