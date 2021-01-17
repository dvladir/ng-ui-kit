export interface SimpleMessage {
  readonly message: string;
  readonly view?: string;
  readonly params?: {[name: string]: string | number | SimpleMessage};
}
