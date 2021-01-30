import {Injectable} from '@angular/core';
import {Observable, timer} from 'rxjs';
import {User, USERS} from '../shared/users-data';
import {map, tap} from 'rxjs/operators';
import {PaginationData, Sort, SortField} from '@vt/core';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  loadAllUsers(): Observable<ReadonlyArray<User>> {
    return timer(1500).pipe(
      tap(_ => console.log('LOCAL')),
      map(_ => USERS)
    );
  }

  private createSortPredicate(sort: SortField): (a: User, b: User) => number {
    return (a, b) => {

      if (sort.sort === Sort.none) {
        return 0;
      }

      let ta: string, tb: string;
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

    return timer(1500).pipe(
      tap(_ => console.log('REMOTE')),
      map(x => result)
    );
  }

}
