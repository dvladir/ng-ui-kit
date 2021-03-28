export abstract class Indicator {
  readonly abstract isInProgress: boolean;
  abstract show(): void;
  abstract hide(): void;
}
