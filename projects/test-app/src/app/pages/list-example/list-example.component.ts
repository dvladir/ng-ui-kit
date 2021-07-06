import { Component, OnInit } from '@angular/core';
import {ValueStoreService} from '../../services/value-store.service';
import {UserListSourceService} from '../../services/user-list-source.service';

@Component({
  selector: 'dva-list-example',
  templateUrl: './list-example.component.html',
  styleUrls: ['./list-example.component.scss']
})
export class ListExampleComponent {

  constructor(
    public vs: ValueStoreService,
    public usersProvider: UserListSourceService
  ) { }

}
