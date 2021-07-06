export interface ErrorInfo {
  children: { [key: string]: ErrorInfo };
  errors: string[];
}
