import {ValueLabel} from '../../../_common/value-label';
import {AsyncDataSource} from './async-data-source';

export type ListDataSource = string | ReadonlyArray<string | number> | ReadonlyArray<ValueLabel<unknown>> | AsyncDataSource<unknown, unknown>;
