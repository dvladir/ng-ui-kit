import {AsyncDataSource} from '../../shared/async-data-source';
import {ValueLabel} from '../../../../_common/value-label';
import {Observable, of} from 'rxjs';

export interface MockKeyValuePair {
  key: number;
  value: string;
}

export class MockAsyncDataSource implements AsyncDataSource<number, MockKeyValuePair> {

  private _allItems: MockKeyValuePair[] = [
    {key: 1, value: 'One'},
    {key: 2, value: 'Two'},
    {key: 3, value: 'Three'},
    {key: 4, value: 'Four'},
    {key: 5, value: 'Five'},
  ];

  convertItem(item: MockKeyValuePair): ValueLabel<number> {
    const {key: value, value: label} = item;
    return {value, label};
  }

  getItemsByIds(...ids: ReadonlyArray<number>): Observable<ReadonlyArray<MockKeyValuePair>> {
    const result = this._allItems.filter(x => ids.includes(x.key));
    return of(result);
  }

  searchItems(query: string): Observable<ReadonlyArray<MockKeyValuePair>> {
    const q = (query || '').toLowerCase();
    const result = this._allItems.filter(x => x.value.toLowerCase().includes(q));
    return of(result);
  }

}
