import {Component, OnDestroy, OnInit, TrackByFunction} from '@angular/core';
import {PaginationConfig, UtilsService} from '@vt/core';
import {BehaviorSubject, combineLatest, Observable, of, Subject} from 'rxjs';
import {map, shareReplay, takeUntil} from 'rxjs/operators';
import {User, USERS} from './shared/users-data';
import {UsersService} from './services/users.service';
import {SortField} from '../../../vt/core/src/lib/shared/sort-field';

@Component({
  selector: 'vta-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy, OnInit {

  constructor(
    private _users: UsersService
  ) {
  }

  private _terminator$: Subject<any> = new Subject<any>();

  private _source$: Observable<ReadonlyArray<User>> = this._users.loadAllUsers().pipe(
    shareReplay(1),
    takeUntil(this._terminator$)
  );

  isLocal = true;

  title = 'test-app';

  paginationConfig: PaginationConfig<User> | undefined;

  private setupPagination(isLocal: boolean): void {
    if (isLocal) {
      this.paginationConfig = {
        source$: this._source$,
        sortPredicates: {
          firstName: (a, b) => a.firstName.localeCompare(b.firstName),
          middleName: (a, b) => a.middleName.localeCompare(b.middleName),
          lastName: (a, b) => a.lastName.localeCompare(b.lastName)
        }
      };
    } else {
      this.paginationConfig = {
        getData: (pageSize: number, currentPage: number, sort: SortField) => this._users.loadUsersPageable(pageSize, currentPage, sort)
      };
    }
  }

  readonly trackByFn: TrackByFunction<User> = (index, item) => item.id;

  ngOnInit(): void {
    this.setupPagination(this.isLocal);
  }

  togglePaginationType(): void {
    this.isLocal = !this.isLocal;
    this.setupPagination(this.isLocal);
  }

  ngOnDestroy(): void {
    this._terminator$.next();
    this._terminator$.complete();
  }

}
