import {v4} from 'uuid';
import {ElementRef} from '@angular/core';

export class Utils {

  private constructor() {
  }

  static randomInt(min: number = 0, max: number = 9999): number {
    const rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
  }

  static uuid(): string {
    return v4();
  }

  static *itemsIterator<T>(...items: T[]): Generator<T> {
    let i = 0;
    while (true) {
      const index = i % items.length;
      const item = items[index];
      i++;
      yield item;
    }
  }

  static focusElementRef(elRef: ElementRef): void {
    if (!elRef?.nativeElement) {
      return;
    }
    setTimeout(() => {
      elRef.nativeElement.focus();
    }, 10);
  }
}
