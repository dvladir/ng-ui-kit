export interface ParseDateStrategy {
  parse(value: string): Date;
}
