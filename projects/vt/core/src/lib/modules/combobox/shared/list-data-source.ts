import {ValueLabel} from './value-label';
import {AsyncDataSource} from './async-data-source';

export type ListDataSource = string | ReadonlyArray<string | number> | ReadonlyArray<ValueLabel<unknown>> | AsyncDataSource<unknown, unknown>;
