import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  TrackByFunction,
  ViewChild
} from '@angular/core';
import {ValueLabel} from '../../../../_common/value-label';
import {ActiveItemService, ListProviderFactoryService} from '../../../list/public-api';
import {ListProvider} from '../../../list/services/list-providers/list-provider';
import {Subject} from 'rxjs';
import {map, takeUntil} from 'rxjs/operators';
import {CdkVirtualScrollViewport} from '@angular/cdk/scrolling';

@Component({
  selector: 'vtc-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss'],
  providers: [
    ActiveItemService
  ]
})
export class StepperComponent<T> implements OnInit, AfterViewInit, OnChanges, OnDestroy {

  constructor(
    public activeItemService: ActiveItemService,
    private _listFactory: ListProviderFactoryService
  ) { }

  private _terminator$: Subject<unknown> = new Subject<unknown>();

  @ViewChild('scrollViewport', {read: CdkVirtualScrollViewport, static: true})
  private _scrollViewport?: CdkVirtualScrollViewport;

  @Input() list: ReadonlyArray<ValueLabel<T>> = [];
  listProvider: ListProvider<T> = this._listFactory.create(this.list) as ListProvider<T>;

  @Input() activeItem?: ValueLabel<T>;

  @Output() activeItemChange: EventEmitter<ValueLabel<T>> = new EventEmitter<ValueLabel<T>>();

  readonly fnTrackBy: TrackByFunction<ValueLabel<T>> = (index, item) => item.value;

  ngOnInit(): void {
    this.activeItemService
      .onActiveItemIndexChange$
      .pipe(
        map(index => {
          const item = this.list[index];
          return {item, index};
        }),
        takeUntil(this._terminator$)
      )
      .subscribe(({item, index}) => {
        this.activeItemChange.emit(item);
        this._scrollViewport!.scrollToIndex(index - 2, 'smooth');
      });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this._scrollViewport!.scrollToIndex(this.activeItemService.activeItemIndex - 2);
    }, 100);
  }


  ngOnChanges(changes: SimpleChanges): void {

    const list = changes.list;
    if (list && list.currentValue !== list.previousValue) {
      this.listProvider = this._listFactory.create(list.currentValue) as ListProvider<T>;
      this.activeItemService.setup(this.listProvider);
    }

    const activeItem = changes.activeItem;
    if (activeItem && activeItem.currentValue !== activeItem.previousValue) {
      const index = (list?.currentValue || this.list).indexOf(activeItem.currentValue);
      this.activeItemService.activeItemIndex = index;
    }
  }

  selectItem(i: number): void {
    setTimeout(() => this.activeItemService.activeItemIndex = i, 100);
  }

  ngOnDestroy(): void {
    this._terminator$.next();
    this._terminator$.complete();
  }

}
