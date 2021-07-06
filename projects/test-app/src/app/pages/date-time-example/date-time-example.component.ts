import { Component } from '@angular/core';

@Component({
  selector: 'dva-date-time-example',
  templateUrl: './date-time-example.component.html',
  styleUrls: ['./date-time-example.component.scss']
})
export class DateTimeExampleComponent {

  date: Date = new Date();
  dateTimeString: string = '';
  dateString: string = '';

}
