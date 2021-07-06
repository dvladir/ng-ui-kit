import { Injectable } from '@angular/core';
import {Indicator} from '../shared/indicator';
import {IndicatorImpl} from '../shared/indicator-impl';

@Injectable({
  providedIn: 'root'
})
export class IndicatorFactoryService {

  create(timerAmount?: number): Indicator {
    return new IndicatorImpl(timerAmount);
  }
}
