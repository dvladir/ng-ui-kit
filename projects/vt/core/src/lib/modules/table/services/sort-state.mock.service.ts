import {Injectable} from '@angular/core';
import {SortStateService} from './sort-state.service';
import {Sort, SortField} from '@vt/core';
import {BehaviorSubject} from 'rxjs';

@Injectable()
export class SortStateMockService implements Partial<SortStateService> {
  value$: BehaviorSubject<SortField> = new BehaviorSubject<SortField>({field: '', sort: Sort.none});
  update(value: SortField): void {
    this.value$.next(value);
  }
}
