import {isValid, parse} from 'date-fns';
import {ParseDateStrategy} from './parse-date-strategy';
import {DateFormat} from '../date-format.enum';

interface DateWithFormat {
  date: Date;
  format: DateFormat;
}

export class ParseDateStrategyTime implements ParseDateStrategy {

  constructor(
    isEndOfDay: boolean = false
  ) {
    this.defaultHour = !isEndOfDay ? 0 : 23;
    this.defaultMinute = !isEndOfDay ? 0 : 59;
    this.defaultSecond = !isEndOfDay ? 0 : 59;
  }

  private readonly defaultHour: number;
  private readonly defaultMinute: number;
  private readonly defaultSecond: number;

  private parseInner(value: string, format: DateFormat): DateWithFormat | undefined {
    const date = parse(value, format.toString(), new Date());
    if (!isValid(date)) {
      return undefined;
    }
    return {date, format};
  }

  parse(value: string): Date {

    const checks: DateFormat[] = [
      DateFormat.DATE_TIME_FULL,
      DateFormat.DATE_TIME,
      DateFormat.DATE_TIME_HOURS,
      DateFormat.DATE
    ];

    const dateWithFormat: DateWithFormat | undefined = checks.reduce((res: DateWithFormat | undefined, format) => {
      if (res) {
        return res;
      }
      return this.parseInner(value, format);
    }, undefined);

    if (!dateWithFormat) {
      return new Date(NaN);
    }

    const result = dateWithFormat.date;
    switch (dateWithFormat.format) {
      case DateFormat.DATE:
        result.setHours(this.defaultHour, this.defaultMinute, this.defaultSecond);
        break;
      case DateFormat.DATE_TIME_HOURS:
        result.setMinutes(this.defaultMinute, this.defaultSecond);
        break;
      case DateFormat.DATE_TIME:
        result.setSeconds(this.defaultSecond);
        break;
      default:
        break;
    }

    return result;
  }
}
