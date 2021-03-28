import {ListProvider} from './list-provider';
import {Observable, of} from 'rxjs';
import {ValueLabel} from '../../shared/value-label';

export class EmptyListProvider implements ListProvider<unknown>{
  readonly items$: Observable<ReadonlyArray<ValueLabel<unknown>>> = of([]);

  searchValue: string = '';

  readonly isPending: boolean = false;

  cleanup(): void {
  }

  getLabelsByValues(...values: ReadonlyArray<unknown>): Promise<ReadonlyArray<string>> {
    return Promise.resolve([]);
  }
}
