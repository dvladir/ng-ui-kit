import {
  Component,
  ElementRef,
  forwardRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {noop} from 'rxjs';
import {ListProviderFactoryService} from '../../services/list-provider-factory.service';
import {ListProvider} from '../../services/list-providers/list-provider';
import {ListDataSource} from '../../shared/list-data-source';
import {ValueLabel} from '../../../../_common/value-label';
import {DropdownComponent} from '../dropdown/dropdown.component';

const READONLY: string = 'readonly';

interface ReadonlyState {
  readonlyState?: string;
}

@Component({
  selector: 'vtc-combobox',
  templateUrl: './combobox.component.html',
  styleUrls: ['./combobox.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ComboboxComponent),
      multi: true
    }
  ]
})
export class ComboboxComponent implements OnDestroy, OnChanges, ControlValueAccessor {

  constructor(
    private _listProviderFactory: ListProviderFactoryService,
  ) { }

  @Input() showAll: boolean = false;
  @Input() dataSource?: ListDataSource;
  @Input() vtTabIndex?: number;

  private _onChange: (value?: unknown) => void = noop;

  @ViewChild('searchInput', {static: true})
  private _searchInput!: ElementRef;

  @ViewChild('readonlyView', {static: true})
  private _readonlyView!: ElementRef;

  @ViewChild('vtcDropdown', {static: true, read: DropdownComponent})
  private _dropdown!: DropdownComponent;

  listProvider: ListProvider<unknown> = this._listProviderFactory.create();

  readonly readonlyState?: string;

  private _selectedItem?: ValueLabel<unknown>;

  get selectedItem(): ValueLabel<unknown> | undefined {
    return this._selectedItem;
  }

  set selectedItem(value: ValueLabel<unknown> | undefined) {
    const isValueSame = this._selectedItem?.value === value?.value;
    const isLabelSame = this._selectedItem?.label === value?.label;

    if (!isValueSame || !isLabelSame) {
      this._selectedItem = value;
    }

    if (!isValueSame) {
      this._onChange(value?.value);
    }

  }

  private focusElementRef(elRef: ElementRef): void {
    if (!elRef?.nativeElement) {
      return;
    }
    setTimeout(() => {
      elRef.nativeElement.focus();
    }, 10);
  }

  ngOnDestroy(): void {
    this.listProvider.cleanup();
    this._onChange = noop;
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  writeValue(obj: any): void {
    this._selectedItem = {value: obj, label: ''};
  }

  setDisabledState(isDisabled: boolean): void {
    (this as ReadonlyState).readonlyState = isDisabled ? READONLY : undefined;
  }

  ngOnChanges(changes: SimpleChanges): void {
    const ds = changes.dataSource;
    if (!!ds && ds.currentValue !== ds.previousValue) {
      this.listProvider.cleanup();
      this.listProvider = this._listProviderFactory.create(ds.currentValue as ListDataSource);
    }
  }

  onKeyUp(): void {
    this._dropdown.selectPrevItem();
  }

  onKeyDown(): void {
    this._dropdown.selectNextItem();
  }

  async close(updateValue: boolean = false): Promise<unknown> {
    const isClosed = await this._dropdown.close(updateValue);
    if (isClosed) {
      this.focusElementRef(this._readonlyView);
    }
    return undefined;
  }

  open(): void {
    if (!!this.readonlyState) {
      return;
    }
    const isOpened = this._dropdown.open();
    if (isOpened) {
      this.focusElementRef(this._searchInput);
    }
  }

  clear(): void {
    if (!!this.readonlyState) {
      return;
    }
    this.selectedItem = {value: undefined, label: ''};
  }

}
