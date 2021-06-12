import { Injectable } from '@angular/core';
import {UpdatableValue} from '../../../_common/updatable-value';

@Injectable()
export class PageSateService extends UpdatableValue<number | undefined>{
  protected getDefaultValue(): number | undefined {
    return undefined;
  }
}
