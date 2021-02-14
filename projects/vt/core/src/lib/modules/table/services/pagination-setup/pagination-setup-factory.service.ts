import { Injectable } from '@angular/core';
import {PaginationSetup} from './pagination-setup';
import {LocalPaginationConfig, LocalPaginationSetup} from './local-pagination-setup';
import {RemotePaginationConfig, RemotePaginationSetup} from './remote-pagination-setup';

export type PaginationConfig<T> = LocalPaginationConfig<T> | RemotePaginationConfig<T>;

@Injectable()
export class PaginationSetupFactoryService {

  create<T>(config: PaginationConfig<T>): PaginationSetup<T> {

    let paginationSetup: PaginationSetup<T> | undefined;

    if (!!(config as LocalPaginationConfig<T>).source$) {
      const conf = config as LocalPaginationConfig<T>;
      paginationSetup = new LocalPaginationSetup(conf);
    }

    if (!!(config as RemotePaginationConfig<T>).getData) {
      const conf = config as RemotePaginationConfig<T>;
      paginationSetup = new RemotePaginationSetup(conf);
    }

    if (!paginationSetup) {
      throw new Error(`Passed config is invalid. Use another one`);
    }

    return paginationSetup;
  }
}
