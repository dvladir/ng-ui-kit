import { Pipe, PipeTransform } from '@angular/core';
import { ValueLabel } from '../../../_common/value-label';
import {PhoneMaskItem} from '../shared/phone-mask-item';

@Pipe({
  name: 'masks2ListItems'
})
export class Masks2ListItemsPipe implements PipeTransform {

  transform(items: PhoneMaskItem[]): ValueLabel<PhoneMaskItem>[]{
    return (items || []).map(item => {
      const value = item;
      const label = item.code;
      return {value, label};
    });
  }

}
