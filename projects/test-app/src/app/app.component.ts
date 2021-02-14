import {Component, OnDestroy, OnInit, TrackByFunction} from '@angular/core';
import {ModalService, PaginationConfig, SortField} from '@vt/core';
import {Observable, Subject} from 'rxjs';
import {shareReplay, takeUntil} from 'rxjs/operators';
import {User} from './shared/users-data';
import {UsersService} from './services/users.service';
import {ComponentPortal} from '@angular/cdk/portal';
import {TestModalComponent} from './components/test-modal/test-modal.component';

@Component({
  selector: 'vta-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy, OnInit {

  constructor(
    private _users: UsersService,
    private _modalService: ModalService
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

  async showModal(): Promise<unknown> {
    const data = 'foo';
    await this._modalService.open(TestModalComponent, {data, showCloseButton: false, closeOnEscape: false, closeOnBackdrop: false});
    console.log('Modal processed');
    return undefined;
  }

  async choose(): Promise<unknown> {
    const message = 'confirm_choose';
    const view = 'MESSAGES';
    const result = await this._modalService.openMultiConfirm({message, view});
    console.log('Choose result:', result);
    return undefined;
  }

  async confirmed(): Promise<unknown> {
    const message = 'confirm';
    const view = 'MESSAGES';
    const result = await this._modalService.openConfirm({message, view});
    console.log('Is confirmed:', result);
    return undefined;
  }

  ngOnDestroy(): void {
    this._terminator$.next();
    this._terminator$.complete();
  }

}
