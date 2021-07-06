import { Component} from '@angular/core';
import {ModalService, ToastService} from '@dvladir/ng-ui-kit';
import {TestModalComponent} from '../../components/test-modal/test-modal.component';

@Component({
  selector: 'dva-messages-example',
  templateUrl: './messages-example.component.html',
  styles: [`
    button {
      width: 10rem;
    }
  `]
})
export class MessagesExampleComponent {

  constructor(
    private _modalService: ModalService,
    private _toastService: ToastService
  ) { }

  async showModal(): Promise<unknown> {
    const data = 'foo';
    await this._modalService.open(TestModalComponent, {data, showCloseButton: false, closeOnEscape: false, closeOnBackdrop: false});
    console.log('Modal processed');
    return undefined;
  }

  async choose(): Promise<unknown> {
    const message = 'confirm_choose';
    const view = 'MESSAGES';
    const result = await this._modalService.openMultiConfirm({message, view});
    console.log('Choose result:', result);
    return undefined;
  }

  async confirmed(): Promise<unknown> {
    const message = 'confirm';
    const view = 'MESSAGES';
    const result = await this._modalService.openConfirm({message, view});
    console.log('Is confirmed:', result);
    return undefined;
  }

  async message(): Promise<unknown> {
    const message = 'info_message';
    const view = 'MESSAGES';
    const result = await this._modalService.openMessage({message, view});
    console.log('Message:', result);
    return undefined;
  }

  successMessage(): void {
    this._toastService.okMessage('success_message');
  }

  warningMessage(): void {
    this._toastService.warnMessage('warning_message');
  }

  errorMessage(): void {
    this._toastService.errorMessage('error_message');
  }

  infoMessage(): void {
    this._toastService.infoMessage('info_message');
  }

}
