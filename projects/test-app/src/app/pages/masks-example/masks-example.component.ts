import { Component } from '@angular/core';
import {ValueStoreService} from '../../services/value-store.service';
import {PhoneMaskItem} from '@dvladir/ng-ui-kit';

@Component({
  selector: 'dva-masks-example',
  templateUrl: './masks-example.component.html',
  styleUrls: ['./masks-example.component.scss']
})
export class MasksExampleComponent {

  constructor(
    public vs: ValueStoreService
  ) { }

  readonly maskPhone: string = '{+7} 000 000-00-00';

  readonly phoneMasks: PhoneMaskItem[] = [
    {code: '+7', mask: '(000) 000-00-00'},
    {code: '+1', mask: '000 000-00-00'},
    {code: '+49', mask: '(0000) 000-0000'},
  ];
}
