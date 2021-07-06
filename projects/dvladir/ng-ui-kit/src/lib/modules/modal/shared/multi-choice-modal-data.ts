import {VtMessage} from '../../translations/public-api';
import {ButtonDescription} from './button-description';

export interface MultiChoiceModalData<T> {
  readonly message: VtMessage;
  readonly buttons: ReadonlyArray<ButtonDescription<T>>;
}
