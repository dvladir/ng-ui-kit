import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'vta-date-time-example',
  templateUrl: './date-time-example.component.html',
  styleUrls: ['./date-time-example.component.scss']
})
export class DateTimeExampleComponent implements OnInit {

  constructor() { }

  date: Date = new Date();

  ngOnInit(): void {
  }

}
