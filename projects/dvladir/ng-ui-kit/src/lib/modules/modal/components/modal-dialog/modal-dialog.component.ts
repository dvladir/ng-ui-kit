import {Component, Input} from '@angular/core';
import { DvMessage } from '../../../translations/shared/dv-message';
import {ModalRef} from '../../shared/modal-ref';

@Component({
  selector: 'dv-modal-dialog',
  templateUrl: './modal-dialog.component.html',
  styleUrls: ['./modal-dialog.component.scss']
})
export class ModalDialogComponent {

  constructor(
    public ref: ModalRef
  ) { }

  @Input() headerCaption?: DvMessage;
}
