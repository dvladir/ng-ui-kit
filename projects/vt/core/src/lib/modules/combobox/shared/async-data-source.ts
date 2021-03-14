import {Observable} from 'rxjs';
import {ValueLabel} from './value-label';

export interface AsyncDataSource<ID, ITEM> {
  searchItems(query: string): Observable<ReadonlyArray<ITEM>>;
  getItemsByIds(...ids: ReadonlyArray<ID>): Observable<ReadonlyArray<ITEM>>;
  convertItem(item: ITEM): ValueLabel<ID>;
}
