import {VtMessage} from '../../translations/public-api';

export interface ButtonDescription<T> {
  caption: VtMessage;
  btnClass: string;
  btnIcon?: string;
  isDefault?: boolean;
  value: T;
}
