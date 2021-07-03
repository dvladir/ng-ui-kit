import {Inject, Injectable, Optional} from '@angular/core';
import {MSG_DEFAULT_VIEW} from '../shared/tokens';
import {TranslationHelperService, VtMessage} from '../../translations/public-api';
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

  errorMessage(vtMessage: VtMessage, messageView?: string): void {
    this.typedMessage(MessageType.err, vtMessage, messageView);
  }

  okMessage(vtMessage: VtMessage, messageView?: string): void {
    this.typedMessage(MessageType.ok, vtMessage, messageView);
  }

  infoMessage(vtMessage: VtMessage, messageView?: string): void {
    this.typedMessage(MessageType.info, vtMessage, messageView);
  }

  warnMessage(vtMessage: VtMessage, messageView?: string): void {
    this.typedMessage(MessageType.warn, vtMessage, messageView);
  }

  typedMessage(messageType: MessageType, vtMessage: VtMessage, messageView: string = this._msgDefaultView): void {
    const text = this._translate.getTranslation(vtMessage, messageView);
    this._logic.addMessage({messageType, text});
  }

  removeAll(): void {
    this._logic.removeAll();
  }
}
