import {Observable} from 'rxjs';
import {ValueLabel} from '../../shared/value-label';

export interface ListProvider<T> {
  readonly items$: Observable<ReadonlyArray<ValueLabel<T>>>;
  searchValue: string;
  getLabelsByValues(...values: ReadonlyArray<T>): Promise<ReadonlyArray<string>>;
  cleanup(): void;
}
