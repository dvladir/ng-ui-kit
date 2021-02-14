import {Injectable} from '@angular/core';
import {SortField} from '../shared/sort-field';
import {Sort} from '../shared/sort.enum';
import {UpdatableValue} from '../_common/updatable-value';


@Injectable()
export class SortStateService extends UpdatableValue<SortField>{

  constructor() {
    super({field: '', sort: Sort.none});
  }

}
