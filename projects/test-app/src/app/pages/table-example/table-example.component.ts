import {Component, OnDestroy, OnInit, TrackByFunction} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {shareReplay, takeUntil} from 'rxjs/operators';
import {User} from '../../shared/users-data';
import {UsersService} from '../../services/users.service';
import {PaginationConfig, SortField} from '@dvladir/ng-ui-kit';

@Component({
  selector: 'dva-table-example',
  templateUrl: './table-example.component.html',
  styles: [
  ]
})
export class TableExampleComponent implements OnInit, OnDestroy {

  constructor(
    private _users: UsersService,
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
