import {ParseDateStrategy} from './parse-date-strategy';
import {parse} from 'date-fns';
import {DateFormat} from '../date-format.enum';

export class ParseDateStrategySimple implements ParseDateStrategy {
  parse(value: string): Date {
    const date = parse(value, DateFormat.DATE.toString(), new Date());
    return date;
  }
}
