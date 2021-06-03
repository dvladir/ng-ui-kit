import {
  ChangeDetectorRef,
  Component,
  ElementRef, EventEmitter, HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {ListProvider} from '../../services/list-providers/list-provider';
import {ValueLabel} from '../../../../_common/value-label';
import {CdkVirtualScrollViewport} from '@angular/cdk/scrolling';
import {EmptyListProvider} from '../../services/list-providers/empty-list-provider';
import {Subject} from 'rxjs';
import {ActiveItemService} from '../../services/active-item.service';
import {ViewportRuler} from '@angular/cdk/overlay';
import {map, take, takeUntil} from 'rxjs/operators';

interface IsOpenable {
  isOpen: boolean;
}

@Component({
  selector: 'vtc-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  exportAs: 'vtcDropdown',
  providers: [
    ActiveItemService
  ]
})
export class DropdownComponent implements OnInit, OnDestroy, OnChanges {

  constructor(
    private _viewportRuler: ViewportRuler,
    private _cd: ChangeDetectorRef,
    public activeItem: ActiveItemService
  ) { }

  private _terminator$: Subject<any> = new Subject<any>();

  @ViewChild('container', {static: true})
  private _container!: ElementRef;

  @ViewChild('scrollViewport', {read: CdkVirtualScrollViewport, static: false})
  private _scrollViewport?: CdkVirtualScrollViewport;

  readonly isOpen: boolean = false;

  @Input() listProvider: ListProvider<unknown> = new EmptyListProvider();

  @Input() selectedItem?: ValueLabel<unknown>;
  @Output() selectedItemChange: EventEmitter<ValueLabel<unknown>> = new EventEmitter<ValueLabel<unknown>>();

  containerWidth: number = 0;

  ngOnInit(): void {
    this._viewportRuler.change()
      .pipe(
        takeUntil(this._terminator$)
      )
      .subscribe(() => {
        if (this.isOpen) {
          this.containerWidth = this._container.nativeElement.getBoundingClientRect().width;
          this._cd.markForCheck();
        }
      });

    this.activeItem.onActiveItemIndexChange$.subscribe(index => {
      if (index >= 0 && !!this._scrollViewport) {
        this._scrollViewport.scrollToIndex(index);
      }
    });
  }

  ngOnDestroy(): void {
    this._terminator$.next();
    this._terminator$.complete();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const lp = changes.listProvider;
    if (!!lp && lp.currentValue !== lp.previousValue) {
      this.activeItem.setup(lp.currentValue);
    }

    const si = changes.selectedItem;
    if (!!si && (
      si?.currentValue?.value !== si?.previousValue?.value ||
      si?.currentValue?.label !== si?.previousValue?.label
    )) {
      const item = si?.currentValue;
      const value = item?.value;
      this.activeItem.activeValue = value;

      if (!!value && !item?.label) {
        this.listProvider.getLabelsByValues(value).then(([label]) => {
          this.selectedItemChange.emit({value, label});
        });
      } else if (!value) {
        this.selectedItemChange.emit({value, label: ''});
      }
    }
  }

  open(): boolean {
    if (this.isOpen) {
      return false;
    }
    this.containerWidth = this._container.nativeElement.getBoundingClientRect().width;
    this.listProvider.searchValue = this.selectedItem?.label || '';
    (this as IsOpenable).isOpen = true;
    return true;
  }

  async close(updateValue: boolean = false): Promise<boolean> {
    if (!this.isOpen) {
      return false;
    }

    if (!updateValue) {
      (this as IsOpenable).isOpen = false;

      if (!this.listProvider.searchValue) {
        this.selectedItemChange.emit({label: '', value: undefined});
      }

      return true;
    }

    const selectedItem: ValueLabel<unknown> | undefined = await this.listProvider.items$
      .pipe(
        take(1),
        map(items => {
          if (items.length === 1) {
            return items[0];
          }
          return items.find(x => x.value === this.activeItem.activeValue);
        })
      )
      .toPromise();

    (this as IsOpenable).isOpen = false;
    this.selectedItemChange.emit(selectedItem);
    return true;
  }

  @HostListener('document:click', ['$event'])
  onClose(event: MouseEvent): void {
    const t = event.target as HTMLElement;
    const parentContainer = this._container.nativeElement;
    if (t === parentContainer || t.parentElement === parentContainer || t.classList.contains('vt-item')) {
      return;
    }
    this.close();
  }

  selectPrevItem(): void {
    if (!this.isOpen) {
      return;
    }
    this.activeItem.switchPrev();
  }

  selectNextItem(): void {
    if (!this.isOpen) {
      return;
    }
    this.activeItem.switchNext();
  }

  onItemClick(index: number): void {
    this.activeItem.activeItemIndex = index;
    setTimeout(() => this.close(true), 100);
  }

}
