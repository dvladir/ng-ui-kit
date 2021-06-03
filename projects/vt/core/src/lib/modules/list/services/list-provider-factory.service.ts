import { Injectable } from '@angular/core';
import {TranslationHelperService} from '../../translations/public-api';
import {ListProvider} from './list-providers/list-provider';
import {FixedListProvider} from './list-providers/fixed-list-provider';
import {EmptyListProvider} from './list-providers/empty-list-provider';
import {AsyncListProvider} from './list-providers/async-list-provider';
import {AsyncDataSource} from '../shared/async-data-source';
import {ListDataSource} from '../shared/list-data-source';
import {ValueLabel} from '../../../_common/value-label';
import {IndicatorFactoryService} from '../../indicator/public-api';

@Injectable({
  providedIn: 'root'
})
export class ListProviderFactoryService {

  constructor(
    private _tnsHelper: TranslationHelperService,
    private _indicatorFactory: IndicatorFactoryService
  ) { }

  private isAsyncDataSource(source: ListDataSource): boolean {
    const ads = source as AsyncDataSource<unknown, unknown>;
    if (typeof ads.searchItems === 'function' &&
        typeof ads.convertItem === 'function' &&
        typeof ads.getItemsByIds === 'function') {
      return true;
    }
    return false;
  }

  create(source?: ListDataSource): ListProvider<unknown> {

    if (!source) {
      return new EmptyListProvider();
    }

    if (this.isAsyncDataSource(source)) {
      return new AsyncListProvider(source as AsyncDataSource<unknown, unknown>, this._indicatorFactory.create());
    }

    if (source instanceof Array) {

      if (typeof source[0] === 'object') {
        return new FixedListProvider(source as ReadonlyArray<ValueLabel<unknown>>);
      }

      if (typeof source[0] === 'string' || typeof source[0] === 'number') {
        const items: ReadonlyArray<ValueLabel<string | number>> = (source as ReadonlyArray<string | number>).map(value => {
          const label = value.toString();
          return {value, label};
        });
        return new FixedListProvider(items);
      }
    }

    if (typeof source === 'string') {
      const viewDictionary = this._tnsHelper.getView(source);
      const items: ReadonlyArray<ValueLabel<string>> = Object.keys(viewDictionary).map(value => {
        const label = viewDictionary[value];
        return {value, label};
      });
      return new FixedListProvider(items);
    }

    return new EmptyListProvider();

  }
}
