import {Injectable} from '@angular/core';
import {Observable, timer} from 'rxjs';
import {User, USERS} from '../shared/users-data';
import {map, tap} from 'rxjs/operators';
import {PaginationData, Sort, SortField} from '@dvladir/ng-ui-kit';

const TIMEOUT = 500;

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  loadAllUsers(): Observable<ReadonlyArray<User>> {
    return timer(TIMEOUT).pipe(
      tap(_ => console.log('LOCAL')),
      map(_ => USERS)
    );
  }

  private createSortPredicate(sort: SortField): (a: User, b: User) => number {
    return (a, b) => {

      if (sort.sort === Sort.none) {
        return 0;
      }

      let ta: string;
      let tb: string;
      switch (sort.field) {
        case 'firstName':
          ta = a.firstName;
          tb = b.firstName;
          break;
        case 'lastName':
          ta = a.lastName;
          tb = b.lastName;
          break;
        case 'middleName':
          ta = a.middleName;
          tb = b.middleName;
          break;
        default:
          return 0;
      }

      let res = ta.localeCompare(tb);
      if (sort.sort === Sort.desc) {
        res *= -1;
      }

      return res;
    };
  }

  loadUsersPageable(pageSize: number, currentPage: number, sort: SortField): Observable<PaginationData<User>> {

    const users = [...USERS];
    const predicate = this.createSortPredicate(sort);
    users.sort(predicate);

    const totalElements = users.length;

    let totalPages: number = Math.floor(totalElements / pageSize);
    if (totalElements % pageSize !== 0) {
      totalPages++;
    }
    const start = currentPage * pageSize;
    const end = start + pageSize;

    const elements = users.slice(start, end);

    const result: PaginationData<User> = {currentPage, pageSize, totalPages, totalElements, elements, sort};

    return timer(TIMEOUT).pipe(
      tap(_ => console.log('REMOTE')),
      map(_ => result)
    );
  }

  searchUsers(query: string): Observable<ReadonlyArray<User>> {

    query = (query || '').trim().toLowerCase();
    const users = [...USERS];

    const result = !query ? users : users.filter(u => {
      const fullName = `${u.firstName} ${u.middleName} ${u.lastName}`.toLowerCase();
      return fullName.includes(query);
    });

    return timer(TIMEOUT).pipe(
      tap(_ => console.log(`QUERY USERS: ${query}`)),
      map(_ => result)
    );
  }

  findUsersByIds(...userIds: number[]): Observable<ReadonlyArray<User>> {

    const users = [...USERS];
    const result = users.filter(x => userIds.includes(x.id));

    return timer(TIMEOUT).pipe(
      tap(_ => console.log(`FIND USERS BY ID: ${userIds}`)),
      map(_ => result)
    );
  }

}
