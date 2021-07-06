import {
  AfterViewInit,
  Component,
  ContentChildren,
  Input,
  OnChanges,
  OnDestroy,
  QueryList,
  SimpleChanges,
  TrackByFunction,
  ViewChild
} from '@angular/core';
import {BehaviorSubject, Observable, of, Subject} from 'rxjs';
import {map, shareReplay, takeUntil} from 'rxjs/operators';
import {CdkColumnDef, CdkTable} from '@angular/cdk/table';
import {Sort} from '../../shared/sort.enum';
import {PaginationData} from '../../shared/pagination-data';
import {PaginationConfig, PaginationSetupFactoryService} from '../../services/pagination-setup/pagination-setup-factory.service';
import {SortStateService} from '../../services/sort-state.service';
import { Indicator, IndicatorFactoryService } from '../../../indicator/public-api';

@Component({
  selector: 'vtc-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  providers: [
    PaginationSetupFactoryService,
    SortStateService
  ]
})
export class TableComponent<T> implements AfterViewInit, OnDestroy, OnChanges {

  constructor(
    private _paginationSetupFactory: PaginationSetupFactoryService,
    private _sortState: SortStateService,
    private _indicatorFactory: IndicatorFactoryService
  ) {
  }

  readonly indicator: Indicator = this._indicatorFactory.create();

  @ContentChildren(CdkColumnDef, {descendants: true}) colDef: QueryList<CdkColumnDef> | undefined;

  @ViewChild(CdkTable) private _table: CdkTable<any> | undefined;

  @Input() config: PaginationConfig<T>| undefined;

  @Input() set pageSize(value: number) {
    if (value === this.pageSize) {
      return;
    }
    this._pageSize$.next(value);
  }

  get pageSize(): number {
    return this._pageSize$.value;
  }

  private _terminator$: Subject<unknown> | undefined;

  @Input() dataColumns?: ReadonlyArray<string>;

  displayColumns: string[] = [];

  private _pageSize$: BehaviorSubject<number> = new BehaviorSubject<number>(10);

  private _currentPage$: BehaviorSubject<number | undefined> = new BehaviorSubject<number | undefined>(undefined);

  private _refresh$: BehaviorSubject<any> = new BehaviorSubject<any>({});

  private _paginationData$: Observable<PaginationData<T> | undefined> = of(undefined);

  currentPage$: Observable<number> = of(0);
  pageData$: Observable<ReadonlyArray<T>> = of([]);
  pagesCount$: Observable<number> =  of(0);

  @Input() trackBy: TrackByFunction<T> = index => index;

  private terminate(): void {
    if (this._terminator$) {
      this._terminator$.next();
      this._terminator$.complete();
      this._terminator$ = undefined;
    }
  }

  private setupStreams(): void {

    if (this._terminator$) {
      this.terminate();
    }

    this._terminator$ = new Subject<unknown>();

    this._paginationData$ = this._paginationSetupFactory
      .create<T>(this.config!)
      .setup(
        this._refresh$,
        this._pageSize$,
        this._currentPage$.pipe(map(x => x || 0)),
        this._sortState.valueChange$,
        this.indicator
      )
      .pipe(
        takeUntil(this._terminator$),
        shareReplay(1),
        takeUntil(this._terminator$)
    );

    this.pageData$ = this._paginationData$.pipe(map(x => x?.elements || []));
    this.pagesCount$ = this._paginationData$.pipe(map(x => x?.totalPages || 0));
    this.currentPage$ = this._paginationData$.pipe(map(x => x?.currentPage || 0));
    this._paginationData$.subscribe(x => {
      this._sortState.value = x?.sort || {field: '', sort: Sort.none};
    });
  }

  private setupColumns(): void {
    if (!this.colDef) {
      return;
    }

    const allColumns = this.colDef.map(x => x.name);

    if (!this.dataColumns) {
      this.displayColumns = allColumns;
      return;
    }
    this.displayColumns = allColumns.filter(x => this.dataColumns!.includes(x));
  }

  ngAfterViewInit(): void {
    this.colDef!.forEach(item => {
      this._table!.addColumnDef(item);
    });

    setTimeout(() => {
      if (this.displayColumns.length === 0) {
        this.setupColumns();
      }
    });
  }

  refresh(): void {
    this._refresh$.next({});
  }

  updateCurrentPage(page: number): void {
    if (page === this._currentPage$.value) {
      return;
    }
    this._currentPage$.next(page);
  }

  ngOnDestroy(): void {
    this.terminate();
    this._pageSize$.complete();
    this._currentPage$.complete();
    this._refresh$.complete();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes.config) {
      this.setupStreams();
    }

    if (!!changes.dataColumns) {
      this.setupColumns();
    }
  }

}
