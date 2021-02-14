import {ModalRef} from '../../shared/modal-ref';

export abstract class BaseModalComponent<D = unknown, R = unknown> {
  protected constructor(
    ref: ModalRef<D, R>
  ) {
  }
}
