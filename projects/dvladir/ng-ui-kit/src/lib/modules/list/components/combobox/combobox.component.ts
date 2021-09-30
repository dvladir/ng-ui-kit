import {
  Component,
  ElementRef, EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  OnDestroy, Output,
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
import {Utils} from '../../../../_common/utils';

const READONLY: string = 'readonly';

interface ReadonlyState {
  readonlyState?: string;
}

@Component({
  selector: 'dv-combobox',
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
  @Input() dvTabIndex?: number;

  @Output() itemManualSelected: EventEmitter<unknown> = new EventEmitter<unknown>();

  private _onChange: (value?: unknown) => void = noop;

  @ViewChild('searchInput', {static: true})
  private _searchInput!: ElementRef;

  @ViewChild('readonlyView', {static: true})
  private _readonlyView!: ElementRef;

  @ViewChild('dvDropdown', {static: true, read: DropdownComponent})
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

  async close(updateValue: boolean = false, isAutofocus: boolean = true): Promise<unknown> {
    const isClosed = await this._dropdown.close(updateValue);
    if (isClosed && isAutofocus) {
      Utils.focusElementRef(this._readonlyView);
    }
    if (isClosed && updateValue) {
      this.itemManualSelected.emit();
    }
    return undefined;
  }

  open(): void {
    if (!!this.readonlyState) {
      return;
    }
    const isOpened = this._dropdown.open();
    if (isOpened) {
      Utils.focusElementRef(this._searchInput);
    }
  }

  clear(): void {
    if (!!this.readonlyState) {
      return;
    }
    this.selectedItem = {value: undefined, label: ''};
  }

}
