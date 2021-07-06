import {Component, HostBinding} from '@angular/core';
import {Observable} from 'rxjs';
import {ToastLogicService} from '../../services/toast-logic.service';
import {Message} from '../../shared/message';
import {MessageType} from '../../shared/message-type.enum';
import {container, flyIn, flyOut} from './toast-view-animations';

@Component({
  selector: 'dv-toast-view',
  templateUrl: './toast-view.component.html',
  styleUrls: ['./toast-view.component.scss'],
  animations: [
    container,
    flyIn,
    flyOut
  ]
})
export class ToastViewComponent {

  constructor(
    private _toastLogic: ToastLogicService
  ) {
    this.messages$ = this._toastLogic.messages$;
  }

  @HostBinding('@container')
  appearAnimate: 'beforeAdd' | 'afterAdd' = 'afterAdd';

  readonly messages$: Observable<ReadonlyArray<Message>>;

  readonly MessageType: typeof MessageType = MessageType;

  remove(message: Message): void {
    this._toastLogic.removeMessage(message);
  }

}
