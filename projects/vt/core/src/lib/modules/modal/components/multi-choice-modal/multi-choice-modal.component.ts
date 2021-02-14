import { Component, OnInit } from '@angular/core';
import {BaseModalComponent} from '../base-modal/base-modal.component';
import {MultiChoiceModalData} from '../../shared/multi-choice-modal-data';
import {ModalRef} from '../../shared/modal-ref';

@Component({
  selector: 'vtc-multi-choice-modal',
  templateUrl: './multi-choice-modal.component.html',
})
export class MultiChoiceModalComponent extends BaseModalComponent<MultiChoiceModalData<unknown>, unknown> {
    constructor(
      public ref: ModalRef<MultiChoiceModalData<unknown>>
    ) {
      super(ref);
    }
}
