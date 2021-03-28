import {Observable} from 'rxjs';
import {ValueLabel} from '../../shared/value-label';

export interface ListProvider<T> {
  readonly items$: Observable<ReadonlyArray<ValueLabel<T>>>;
  searchValue: string;
  readonly isPending: boolean;
  getLabelsByValues(...values: ReadonlyArray<T>): Promise<ReadonlyArray<string>>;
  cleanup(): void;
}
