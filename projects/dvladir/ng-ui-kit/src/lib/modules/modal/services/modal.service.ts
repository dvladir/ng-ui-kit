import {Injectable, Injector, RendererFactory2} from '@angular/core';
import {ComponentType, Overlay} from '@angular/cdk/overlay';
import {ComponentPortal} from '@angular/cdk/portal';
import {ModalRef, ModalRefImpl} from '../shared/modal-ref';
import {BaseModalComponent} from '../components/base-modal/base-modal.component';
import {ModalOptions} from '../shared/modal-options';
import {MultiChoiceModalData} from '../shared/multi-choice-modal-data';
import {MultiChoiceModalComponent} from '../components/multi-choice-modal/multi-choice-modal.component';
import {Choice} from '../../../_common/choices.enum';
import {ButtonDescription} from '../shared/button-description';
import { DvMessage } from '../../translations/public-api';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor(
    private _overlay: Overlay,
    private _renderFactory: RendererFactory2
  ) {
  }

  open<D = unknown, R = unknown>(
    modalComponent: ComponentType<BaseModalComponent<D, R>>,
    opts: Partial<ModalOptions<D, R>> = {},
    parentInjector?: Injector
  ): Promise<R> {

    const overlayRef = this._overlay.create({
      hasBackdrop: true,
      positionStrategy: this._overlay.position()
        .global()
        .centerHorizontally()
        .centerVertically()
    });

    const modalOptions: ModalOptions<D, R> = {
      ...{showCloseButton: true, closeOnBackdrop: false, closeOnEscape: true},
      ...opts
    };

    return new Promise<R>(resolve => {

      const modalRef: ModalRef<D, R> = new ModalRefImpl(
        modalOptions,
        overlayRef,
        resolve as (value?: R) => any,
        this._renderFactory
      );

      const modalInjector = Injector.create({
        providers: [
          {
            provide: ModalRef,
            useValue: modalRef
          }
        ],
        parent: parentInjector
      });

      const modalComponentPortal = new ComponentPortal(modalComponent, null, modalInjector);
      overlayRef.attach(modalComponentPortal);
    });

  }

  openMultiChoice<R = unknown>(data: MultiChoiceModalData<R>): Promise<R> {

    const modalOptions: Partial<ModalOptions<MultiChoiceModalData<R>, R>> = {
      data,
      defaultResult: data.buttons.find(x => x.isDefault)?.value,
      showCloseButton: false
    };

    return this.open(MultiChoiceModalComponent, modalOptions);
  }

  openMultiConfirm(message: DvMessage): Promise<Choice> {
    const view = 'YES_NO_CANCEL';

    const buttons: ButtonDescription<Choice>[] = [
      {caption: {message: 'yes',    view}, value: Choice.yes,    btnClass: 'btn btn-primary'},
      {caption: {message: 'no',     view}, value: Choice.no,     btnClass: 'btn btn-danger'},
      {caption: {message: 'cancel', view}, value: Choice.cancel, btnClass: 'btn btn-outline-secondary', isDefault: true}
    ];

    return this.openMultiChoice({message, buttons});
  }

  openConfirm(message: DvMessage): Promise<boolean> {
    const view = 'YES_NO_CANCEL';

    const buttons: ButtonDescription<Choice>[] = [
      {caption: {message: 'yes',    view}, value: Choice.yes,    btnClass: 'btn btn-primary'},
      {caption: {message: 'no',     view}, value: Choice.no,     btnClass: 'btn btn-outline-secondary', isDefault: true},
    ];

    return this.openMultiChoice({message, buttons}).then(x => x === Choice.yes);
  }

  openMessage(message: DvMessage): Promise<boolean> {
    const view = 'YES_NO_CANCEL';

    const buttons: ButtonDescription<Choice>[] = [
      {caption: {message: 'ok',    view}, value: Choice.ok,    btnClass: 'btn btn-primary', isDefault: true}
    ];

    return this.openMultiChoice({message, buttons}).then(() => true);
  }
}
