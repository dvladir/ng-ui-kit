import {Inject, Injectable, Optional} from '@angular/core';
import {MSG_DEFAULT_VIEW} from '../shared/tokens';
import {TranslationHelperService, DvMessage} from '../../translations/public-api';
import {ToastLogicService} from './toast-logic.service';
import {MessageType} from '../shared/message-type.enum';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(
    private _translate: TranslationHelperService,
    private _logic: ToastLogicService,
    @Inject(MSG_DEFAULT_VIEW) @Optional() msgDefaultView?: string,
) {
    this._msgDefaultView = !msgDefaultView ? 'MESSAGES' : msgDefaultView;
  }

  private _msgDefaultView: string;

  errorMessage(dvMessage: DvMessage, messageView?: string): void {
    this.typedMessage(MessageType.err, dvMessage, messageView);
  }

  okMessage(dvMessage: DvMessage, messageView?: string): void {
    this.typedMessage(MessageType.ok, dvMessage, messageView);
  }

  infoMessage(dvMessage: DvMessage, messageView?: string): void {
    this.typedMessage(MessageType.info, dvMessage, messageView);
  }

  warnMessage(dvMessage: DvMessage, messageView?: string): void {
    this.typedMessage(MessageType.warn, dvMessage, messageView);
  }

  typedMessage(messageType: MessageType, dvMessage: DvMessage, messageView: string = this._msgDefaultView): void {
    const text = this._translate.getTranslation(dvMessage, messageView);
    this._logic.addMessage({messageType, text});
  }

  removeAll(): void {
    this._logic.removeAll();
  }
}
