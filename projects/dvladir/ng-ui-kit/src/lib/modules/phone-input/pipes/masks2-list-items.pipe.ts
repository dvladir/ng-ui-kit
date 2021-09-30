import { Pipe, PipeTransform } from '@angular/core';
import {PhoneMaskItem} from '../shared/phone-mask-item';
import {ValueLabel} from '@dvladir/ng-ui-kit';

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
