import { Injectable } from '@angular/core';
import {PaginationSetup} from './pagination-setup';
import {Observable} from 'rxjs';
import {PaginationData} from '../../shared/pagination-data';
import {LocalPaginationConfig, LocalPaginationSetup} from './local-pagination-setup';
import {RemotePaginationConfig, RemotePaginationSetup} from './remote-pagination-setup';
import {SortField} from '../../shared/sort-field';

export type PaginationConfig<T> = LocalPaginationConfig<T> | RemotePaginationConfig<T>;

@Injectable()
export class PaginationSetupService<T> implements PaginationSetup<T> {

  private _config?: PaginationConfig<T>;

  setConfig(config: PaginationConfig<T>): this {
    this._config = config;
    return this;
  }

  setup(
    refresh$: Observable<unknown>,
    pageSize$: Observable<number>,
    currentPage$: Observable<number>,
    sort$: Observable<SortField>
  ): Observable<PaginationData<T>> {

    console.log('CONFIG', this._config);

    if (!this._config) {
      throw new Error(`Set pagination's config, before invoking setup`);
    }

    let paginationSetup: PaginationSetup<T> | undefined;

    if (!!(this._config as LocalPaginationConfig<T>).source$) {
      const conf = this._config as LocalPaginationConfig<T>;
      paginationSetup = new LocalPaginationSetup(conf);
    }

    if (!!(this._config as RemotePaginationConfig<T>).getData) {
      const conf = this._config as RemotePaginationConfig<T>;
      paginationSetup = new RemotePaginationSetup(conf);
    }

    if (!paginationSetup) {
      throw new Error(`Passed config is invalid. Use another one`);
    }

    return paginationSetup.setup(refresh$, pageSize$, currentPage$, sort$);
  }
}
