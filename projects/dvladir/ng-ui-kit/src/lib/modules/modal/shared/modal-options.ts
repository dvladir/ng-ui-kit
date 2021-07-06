export interface ModalOptions<D, R> {
  data?: D;
  defaultResult?: R;
  showCloseButton: boolean;
  closeOnEscape: boolean;
  closeOnBackdrop: boolean;
}
