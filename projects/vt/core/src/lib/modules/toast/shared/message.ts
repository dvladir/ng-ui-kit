import {MessageType} from './message-type.enum';

export interface Message {
  text: string;
  messageType: MessageType
}
