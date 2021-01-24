import { Injectable } from '@angular/core';
import {v4} from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  randomInt(min: number = 0, max: number = 9999): number {
    const rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
  }

  uuid(): string {
    return v4();
  }
}
