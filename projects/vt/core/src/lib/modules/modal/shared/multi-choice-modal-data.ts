import {SimpleMessage} from '@vt/core';
import {ButtonDescription} from './button-description';

export interface MultiChoiceModalData<T> {
  readonly message: string | SimpleMessage;
  readonly buttons: ReadonlyArray<ButtonDescription<T>>;
}
