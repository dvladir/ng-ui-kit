import {Component, Input} from '@angular/core';
import { VtMessage } from '../../../translations/shared/vt-message';
import {ModalRef} from '../../shared/modal-ref';

@Component({
  selector: 'vtc-modal-dialog',
  templateUrl: './modal-dialog.component.html',
  styleUrls: ['./modal-dialog.component.scss']
})
export class ModalDialogComponent {

  constructor(
    public ref: ModalRef
  ) { }

  @Input() headerCaption?: VtMessage;
}
