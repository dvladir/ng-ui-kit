import {DvMessage} from '../../translations/public-api';
import {ButtonDescription} from './button-description';

export interface MultiChoiceModalData<T> {
  readonly message: DvMessage;
  readonly buttons: ReadonlyArray<ButtonDescription<T>>;
}
