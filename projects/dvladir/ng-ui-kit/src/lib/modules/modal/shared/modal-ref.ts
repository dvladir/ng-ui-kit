import {ModalOptions} from './modal-options';
import {RendererFactory2} from '@angular/core';
import {OverlayRef} from '@angular/cdk/overlay';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

export abstract class ModalRef<D = unknown, R = unknown>{
  abstract readonly data?: D;
  abstract readonly showCloseButton: boolean;
  abstract close(result?: R): void;
}

export class ModalRefImpl<D = unknown, R = unknown> implements ModalRef<D, R> {

  constructor(
    private _opts: ModalOptions<D, R>,
    private _overlayRef: OverlayRef,
    private _resolve: (value?: R) => any,
    private _renderFactory2: RendererFactory2
  ) {
    this.data = _opts.data;
    this.showCloseButton = _opts.showCloseButton;
    this.setupListeners();
  }

  private _terminator$: Subject<unknown> = new Subject<unknown>();

  readonly data?: D;
  readonly showCloseButton: boolean;

  private setupListeners(): void {

    if (this._opts.closeOnBackdrop) {
      this._overlayRef.backdropClick()
        .pipe(
          takeUntil(this._terminator$)
        )
        .subscribe(() => this.close());
    }

    if (this._opts.closeOnEscape) {
      const renderer = this._renderFactory2.createRenderer(null, null);
      const removeListener = renderer.listen('document', 'keydown', event => {
        const key = event.key.toLowerCase();
        if (key === 'esc' || key === 'escape') {
          this.close();
          removeListener();
        }
      });
    }
  }

  close(result?: R): void {
    this._overlayRef.dispose();
    this._resolve(result || this._opts.defaultResult);
    this.terminate();
  }

  private terminate(): void {
    this._terminator$.next();
    this._terminator$.complete();
  }

}
