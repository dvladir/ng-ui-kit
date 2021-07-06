import { Component } from '@angular/core';
import {ValueStoreService} from '../../services/value-store.service';

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
}
