import {Inject, Injectable, OnDestroy, Optional} from '@angular/core';
import {merge, Observable, Subject} from 'rxjs';
import {map, scan} from 'rxjs/operators';
import {Message} from '../shared/message';
import {MSG_DEFAULT_TTL} from '../shared/tokens';

enum SignalType {
  add,
  remove,
  remove_all
}

interface Signal {
  message?: Message;
  sigType: SignalType;
}

const createSignal: (sigType: SignalType) => (src$: Observable<Message>) => Observable<Signal> = sigType => src$ => src$.pipe(
  map(message => ({message, sigType})),
);

@Injectable({
  providedIn: 'root'
})
export class ToastLogicService implements OnDestroy {

  constructor(
    @Inject(MSG_DEFAULT_TTL) @Optional() msgDefaultTtl?: number
  ) {
    this._msgDefaultTtl = !msgDefaultTtl ? 30000 : msgDefaultTtl;
  }

  private _msgDefaultTtl: number;

  private _removeAll$: Subject<Message> = new Subject<Message>();
  private _addMessage$: Subject<Message> = new Subject<Message>();
  private _removeMessage$: Subject<Message> = new Subject<Message>();

  private _sigRemoveAll$: Observable<Signal> = this._removeAll$.pipe(createSignal(SignalType.remove_all));
  private _sigAddMessage$: Observable<Signal> = this._addMessage$.pipe(createSignal(SignalType.add));
  private _sigRemoveMessage$: Observable<Signal> = this._removeMessage$.pipe(createSignal(SignalType.remove));

  readonly messages$: Observable<ReadonlyArray<Message>> = merge(this._sigAddMessage$, this._sigRemoveMessage$, this._sigRemoveAll$).pipe(
    scan<Signal, Message[]>((acc: Message[], sig: Signal) => {
      switch (sig.sigType) {
        case SignalType.remove_all:
          acc.length = 0;
          break;
        case SignalType.remove:
          const index: number = acc.indexOf(sig.message!);
          if (index >= 0) {
            acc.splice(index, 1);
          }
          break;
        case SignalType.add:
          const hasDuplicates: boolean = !!acc.find(m => m.messageType === sig.message!.messageType && m.text === sig.message!.messageType);
          if (!hasDuplicates) {
            acc.unshift(sig.message!);
          }
          break;
        default:
          break;
      }
      return acc;
    }, []),
    map((messages: Message[]) => messages.slice(0, 6).reverse())
  );

  addMessage(message: Message, ttl: number = this._msgDefaultTtl): void {
    this._addMessage$.next(message);
    setTimeout(() => this._removeMessage$.next(message), ttl);
  }

  removeMessage(message: Message): void {
    this._removeMessage$.next(message);
  }

  removeAll(): void {
    this._removeAll$.next(undefined);
  }

  ngOnDestroy(): void {
    this._removeAll$.complete();
    this._addMessage$.complete();
    this._removeMessage$.complete();
  }

}
