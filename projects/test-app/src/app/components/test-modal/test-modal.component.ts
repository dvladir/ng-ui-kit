import { Component } from '@angular/core';
import {BaseModalComponent, ModalRef} from '@dvladir/ng-ui-kit';

@Component({
  selector: 'vta-test-modal',
  templateUrl: './test-modal.component.html',
  styleUrls: ['./test-modal.component.scss']
})
export class TestModalComponent extends BaseModalComponent<string> {

  constructor(
    public ref: ModalRef<string>
  ) {
    super(ref);
    this.data = ref.data || '';
  }

  data: string;

  close(): void {
    this.ref.close();
  }

}
