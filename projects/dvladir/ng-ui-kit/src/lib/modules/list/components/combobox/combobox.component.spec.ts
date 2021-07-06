import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import { ComboboxComponent } from './combobox.component';
import {CdkExportModule} from '../../../cdk-export/cdk-export.module';
import {DropdownComponent} from '../dropdown/dropdown.component';
import {TranslationHelperService} from '../../../translations/public-api';
import {MockTnsHelper} from '../../../translations/services/mock-tns-helper';
import {Component, DebugElement, NO_ERRORS_SCHEMA} from '@angular/core';
import {ValueLabel} from '../../../../_common/value-label';
import {By} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'dv-combobox-test-host',
  template: `
    <dv-combobox [(ngModel)]="value" [dataSource]="list" [disabled]="isDisabled"></dv-combobox>
  `
})
class ComboboxTestHostComponent {
  value?: number;
  list?: ReadonlyArray<ValueLabel<number>>;
  isDisabled: boolean = false;
}

describe('ComboboxComponent', () => {
  let component: ComboboxComponent;
  let hostComponent: ComboboxTestHostComponent;
  let componentRef: DebugElement;
  let fixture: ComponentFixture<ComboboxTestHostComponent>;

  const list: ReadonlyArray<ValueLabel<number>> = [
    {value: 1, label: 'One'},
    {value: 2, label: 'Two'},
    {value: 3, label: 'Three'},
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CdkExportModule,
        FormsModule
      ],
      declarations: [
        ComboboxTestHostComponent,
        ComboboxComponent,
        DropdownComponent
      ],
      providers: [
        {
          provide: TranslationHelperService,
          useClass: MockTnsHelper
        }
      ],
      schemas: [
        NO_ERRORS_SCHEMA
      ]
    })
    .compileComponents();
  });

  const getElements = () => {
    const dropdown = componentRef.query(By.directive(DropdownComponent)).componentInstance as DropdownComponent;
    const searchInput = componentRef.query(By.css('input.form-control')).nativeElement as HTMLInputElement;
    const readonlyView = componentRef.query(By.css('div.form-control')).nativeElement as HTMLDivElement;

    return {dropdown, searchInput, readonlyView};
  };

  beforeEach(() => {
    fixture = TestBed.createComponent(ComboboxTestHostComponent);
    hostComponent = fixture.componentInstance;
    componentRef = fixture.debugElement.query(By.directive(ComboboxComponent));
    component = componentRef.componentInstance;
    fixture.detectChanges();
  });

  it('Select item', fakeAsync(() => {
    hostComponent.list = list;
    fixture.detectChanges();
    expect(component.selectedItem).toEqual({value: null, label: ''});
    hostComponent.value = 2;
    fixture.detectChanges();
    tick(100);
    expect(component.selectedItem).toEqual({value: 2, label: ''});
    fixture.detectChanges();
    tick(100);
    expect(component.selectedItem).toEqual({value: 2, label: 'Two'});

    component.selectedItem = list[2];
    fixture.detectChanges();
    tick(100);
    expect(hostComponent.value).toEqual(3);
  }));

  it('Open / close (not disabled)', fakeAsync(() => {
    const {dropdown, searchInput, readonlyView} = getElements();

    spyOn(dropdown, 'open').and.callThrough();
    spyOn(dropdown, 'close').and.callThrough();
    spyOn(searchInput, 'focus').and.callThrough();
    spyOn(readonlyView, 'focus').and.callThrough();

    expect(dropdown.open).not.toHaveBeenCalled();
    expect(dropdown.close).not.toHaveBeenCalled();
    expect(searchInput.focus).not.toHaveBeenCalled();
    expect(readonlyView.focus).not.toHaveBeenCalled();
    expect(searchInput.classList.contains('is-hidden')).toBeTrue();
    expect(readonlyView.classList.contains('is-hidden')).toBeFalse();

    readonlyView.click();
    fixture.detectChanges();
    tick(200);

    expect(dropdown.open).toHaveBeenCalled();
    expect(dropdown.close).not.toHaveBeenCalled();
    expect(searchInput.focus).toHaveBeenCalledWith();
    expect(readonlyView.focus).not.toHaveBeenCalled();
    expect(searchInput.classList.contains('is-hidden')).toBeFalse();
    expect(readonlyView.classList.contains('is-hidden')).toBeTrue();

    const event = new KeyboardEvent('keydown', {key: 'Escape'});
    searchInput.dispatchEvent(event);
    fixture.detectChanges();
    tick(200);

    expect(dropdown.close).toHaveBeenCalled();
    expect(readonlyView.focus).toHaveBeenCalled();
    expect(searchInput.classList.contains('is-hidden')).toBeTrue();
    expect(readonlyView.classList.contains('is-hidden')).toBeFalse();
  }));

  it('Open (disabled)', fakeAsync(() => {

    hostComponent.isDisabled = true;
    fixture.detectChanges();
    tick(200);

    const {dropdown, searchInput, readonlyView} = getElements();

    spyOn(dropdown, 'open').and.callThrough();
    spyOn(dropdown, 'close').and.callThrough();
    spyOn(searchInput, 'focus').and.callThrough();
    spyOn(readonlyView, 'focus').and.callThrough();

    expect(dropdown.open).not.toHaveBeenCalled();
    expect(dropdown.close).not.toHaveBeenCalled();
    expect(searchInput.focus).not.toHaveBeenCalled();
    expect(readonlyView.focus).not.toHaveBeenCalled();
    expect(searchInput.classList.contains('is-hidden')).toBeTrue();
    expect(readonlyView.classList.contains('is-hidden')).toBeFalse();

    readonlyView.click();
    fixture.detectChanges();
    tick(200);

    expect(dropdown.open).not.toHaveBeenCalled();
    expect(dropdown.close).not.toHaveBeenCalled();
    expect(searchInput.focus).not.toHaveBeenCalled();
    expect(readonlyView.focus).not.toHaveBeenCalled();
    expect(searchInput.classList.contains('is-hidden')).toBeTrue();
    expect(readonlyView.classList.contains('is-hidden')).toBeFalse();

  }));

  it('Key up / key down', fakeAsync(() => {
    const {dropdown, searchInput, readonlyView} = getElements();
    spyOn(dropdown, 'selectPrevItem').and.callThrough();
    spyOn(dropdown, 'selectNextItem').and.callThrough();
    readonlyView.click();
    fixture.detectChanges();
    tick(200);

    expect(dropdown.selectPrevItem).not.toHaveBeenCalled();
    expect(dropdown.selectNextItem).not.toHaveBeenCalled();

    const up = new KeyboardEvent('keydown', {key: 'ArrowUp'});
    const down = new KeyboardEvent('keydown', {key: 'ArrowDown'});

    searchInput.dispatchEvent(up);
    expect(dropdown.selectPrevItem).toHaveBeenCalled();
    expect(dropdown.selectNextItem).not.toHaveBeenCalled();

    searchInput.dispatchEvent(down);
    expect(dropdown.selectPrevItem).toHaveBeenCalled();
  }));

  it('Clear', fakeAsync(() => {

    const {readonlyView} = getElements();

    hostComponent.list = list;
    hostComponent.value = 2;
    fixture.detectChanges();
    tick(100);
    fixture.detectChanges();
    tick(100);
    expect(component.selectedItem).toEqual({value: 2, label: 'Two'});

    const backspace = new KeyboardEvent('keydown', {key: 'Backspace'});
    readonlyView.dispatchEvent(backspace);
    fixture.detectChanges();
    tick(100);
    expect(component.selectedItem).toEqual({value: undefined, label: ''});
    expect(hostComponent.value).toBeUndefined();

    hostComponent.value = 2;
    fixture.detectChanges();
    tick(100);
    fixture.detectChanges();
    tick(100);
    expect(component.selectedItem).toEqual({value: 2, label: 'Two'});
    hostComponent.isDisabled = true;
    fixture.detectChanges();
    tick(100);

    readonlyView.dispatchEvent(backspace);
    fixture.detectChanges();
    tick(100);
    expect(component.selectedItem).toEqual({value: 2, label: 'Two'});
    expect(hostComponent.value).toEqual(2);

  }));

});
