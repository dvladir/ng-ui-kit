import { Injectable } from '@angular/core';
import {AsyncDataSource, ValueLabel} from '@dvladir/ng-ui-kit';
import {UsersService} from './users.service';
import {User} from '../shared/users-data';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserListSourceService implements AsyncDataSource<number, User> {

  constructor(
    private _userService: UsersService
  ) {
  }

  convertItem(item: User): ValueLabel<number> {
    const value = item.id;
    const label = `${item.firstName} ${item.middleName} ${item.lastName}`;
    return {value, label};
  }

  getItemsByIds(...ids: ReadonlyArray<number>): Observable<ReadonlyArray<User>> {
    return this._userService.findUsersByIds(...ids);
  }

  searchItems(query: string): Observable<ReadonlyArray<User>> {
    return this._userService.searchUsers(query);
  }
}
