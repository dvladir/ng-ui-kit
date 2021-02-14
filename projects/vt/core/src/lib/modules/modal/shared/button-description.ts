import {SimpleMessage} from '@vt/core';

export interface ButtonDescription<T> {
  caption: string | SimpleMessage;
  btnClass: string;
  btnIcon?: string;
  isDefault?: boolean;
  value: T;
}
