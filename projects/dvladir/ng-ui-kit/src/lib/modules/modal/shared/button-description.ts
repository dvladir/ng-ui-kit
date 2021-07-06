import {DvMessage} from '../../translations/public-api';

export interface ButtonDescription<T> {
  caption: DvMessage;
  btnClass: string;
  btnIcon?: string;
  isDefault?: boolean;
  value: T;
}
