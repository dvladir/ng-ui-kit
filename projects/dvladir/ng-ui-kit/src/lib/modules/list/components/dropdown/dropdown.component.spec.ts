import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import { DropdownComponent } from './dropdown.component';
import {ActiveItemService} from '../../services/active-item.service';
import {Component, DebugElement, NO_ERRORS_SCHEMA} from '@angular/core';
import {ViewportRuler} from '@angular/cdk/overlay';
import {Observable, Subject} from 'rxjs';
import {CdkExportModule} from '../../../cdk-export/cdk-export.module';
import {By} from '@angular/platform-browser';
import {CdkVirtualScrollViewport} from '@angular/cdk/scrolling';
import {FixedListProvider} from '../../services/list-providers/fixed-list-provider';
import {ListProvider} from '../../services/list-providers/list-provider';
import {ValueLabel} from '../../../../_common/value-label';
import {EmptyListProvider} from '../../services/list-providers/empty-list-provider';

@Component({
  selector: 'dv-dropdown-test-host',
  template: `
    <dv-dropdown [(selectedItem)]="selectedItem" [listProvider]="listProvider">
        Dropdown component host
    </dv-dropdown>
  `
})
class DropdownTestHostComponent {
  listProvider?: ListProvider<unknown> = new EmptyListProvider();
  selectedItem?: ValueLabel<number | undefined>;
}

describe('DropdownComponent', () => {
  let component: DropdownComponent;
  let hostComponent: DropdownTestHostComponent;
  let componentRef: DebugElement;
  let fixture: ComponentFixture<DropdownTestHostComponent>;
  let activeItemService: ActiveItemService;
  let listProvider: FixedListProvider<number>;

  let change$: Subject<unknown>;

  beforeEach(async () => {

    change$ = new Subject<unknown>();

    await TestBed.configureTestingModule({
      imports: [
        CdkExportModule
      ],
      declarations: [
        DropdownComponent,
        DropdownTestHostComponent
      ],
      providers: [
        ViewportRuler
      ],
      schemas: [
        NO_ERRORS_SCHEMA
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    const viewPortRuler = TestBed.inject(ViewportRuler);
    spyOn(viewPortRuler, 'change').and.callFake(() => change$ as Observable<Event>);
  });

  beforeEach(() => {
    listProvider = new FixedListProvider<number>([
      {value: 1, label: 'One'},
      {value: 2, label: 'Two'},
      {value: 3, label: 'Three'}
    ]);

    fixture = TestBed.createComponent(DropdownTestHostComponent);
    hostComponent = fixture.componentInstance;
    componentRef = fixture.debugElement.query(By.directive(DropdownComponent));
    activeItemService = componentRef.injector.get(ActiveItemService);
    component = componentRef.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    if (change$) {
      change$.complete();
    }
  });

  it('Update container width on ruler change (closed state)', fakeAsync(() => {
    const cd = (component as any)._cd;
    spyOn(cd, 'markForCheck').and.callThrough();

    expect(component.containerWidth).toBe(0);
    const container = componentRef.query(By.css('div'));
    const WIDTH = 777;
    spyOn(container.nativeElement, 'getBoundingClientRect').and.callFake(() => ({width: WIDTH}));

    expect(cd.markForCheck).not.toHaveBeenCalled();
    expect(component.isOpen).toBeFalse();
    change$.next();

    tick(100);
    expect(component.containerWidth).toBe(0);
    expect(cd.markForCheck).not.toHaveBeenCalled();
  }));

  it('Update container width on ruler change (open state)', fakeAsync(() => {
    const cd = (component as any)._cd;
    spyOn(cd, 'markForCheck').and.callThrough();

    expect(component.containerWidth).toBe(0);
    const container = componentRef.query(By.css('div'));
    let WIDTH = 777;
    spyOn(container.nativeElement, 'getBoundingClientRect').and.callFake(() => ({width: WIDTH}));


    expect(component.open()).toBeTrue();
    expect(component.containerWidth).toBe(777);
    expect(component.isOpen).toBeTrue();

    WIDTH = 123;

    expect(cd.markForCheck).not.toHaveBeenCalled();
    change$.next();

    tick(100);
    expect(component.containerWidth).toBe(123);
    expect(cd.markForCheck).toHaveBeenCalled();
  }));

  it('Scroll to index', fakeAsync(() => {
    let virtualScroll = componentRef.query(By.directive(CdkVirtualScrollViewport));
    expect(virtualScroll).toBeNull();

    component.open();
    fixture.detectChanges();

    virtualScroll = componentRef.query(By.directive(CdkVirtualScrollViewport));
    expect(virtualScroll).not.toBeNull();

    const scroll: CdkVirtualScrollViewport = virtualScroll.componentInstance;
    const scrollSpy = spyOn(scroll, 'scrollToIndex').and.callThrough();

    expect(scroll.scrollToIndex).not.toHaveBeenCalled();

    activeItemService.activeItemIndex = 10;
    tick(100);

    expect(scroll.scrollToIndex).toHaveBeenCalledWith(10);
    scrollSpy.calls.reset();

    activeItemService.activeItemIndex = -1;
    tick(100);

    expect(scroll.scrollToIndex).not.toHaveBeenCalled();
  }));

  it('Setup list provider', () => {
    spyOn(activeItemService, 'setup').and.callThrough();
    expect(activeItemService.setup).not.toHaveBeenCalled();

    const defaultProvider = hostComponent.listProvider;

    hostComponent.listProvider = defaultProvider;
    fixture.detectChanges();
    expect(activeItemService.setup).not.toHaveBeenCalled();

    hostComponent.listProvider = listProvider;
    fixture.detectChanges();
    expect(activeItemService.setup).toHaveBeenCalledWith(listProvider);
  });

  it('Update selected item', fakeAsync(() => {
    hostComponent.listProvider = listProvider;
    fixture.detectChanges();

    expect(activeItemService.activeValue).toBeUndefined();

    hostComponent.selectedItem = {value: 1, label: 'One'};
    fixture.detectChanges();
    expect(activeItemService.activeValue).toBe(1);

    hostComponent.selectedItem = {value: undefined};
    fixture.detectChanges();
    expect(hostComponent.selectedItem).toEqual({value: undefined, label: ''});

    hostComponent.selectedItem = {value: 2};
    fixture.detectChanges();
    tick(100);
    expect(hostComponent.selectedItem).toEqual({value: 2, label: 'Two'});
  }));

  it('Switch previous item', () => {
    spyOn(activeItemService, 'switchPrev');
    expect(activeItemService.switchPrev).not.toHaveBeenCalled();

    component.selectPrevItem();
    expect(activeItemService.switchPrev).not.toHaveBeenCalled();

    component.open();
    component.selectPrevItem();
    expect(activeItemService.switchPrev).toHaveBeenCalled();
  });

  it('Switch next item', () => {
    spyOn(activeItemService, 'switchNext');
    expect(activeItemService.switchNext).not.toHaveBeenCalled();

    component.selectNextItem();
    expect(activeItemService.switchNext).not.toHaveBeenCalled();

    component.open();
    component.selectNextItem();
    expect(activeItemService.switchNext).toHaveBeenCalled();
  });

  it('On item click', fakeAsync(() => {
    spyOn(component, 'close').and.callFake((updateValue?: boolean) => Promise.resolve(true));

    hostComponent.listProvider = listProvider;
    fixture.detectChanges();

    expect(activeItemService.activeItemIndex).toBe(-1);
    expect(component.close).not.toHaveBeenCalled();

    let items = componentRef.queryAll(By.css('a.dv-item'));
    expect(items.length).toBe(0);

    component.open();
    fixture.autoDetectChanges();
    tick(500);

    items = componentRef.queryAll(By.css('a.dv-item'));
    expect(items.length).toBe(3);

    (items[1].nativeElement as HTMLElement).click();
    expect(activeItemService.activeItemIndex).toBe(1);

    tick(110);
    expect(component.close).toHaveBeenCalledWith(true);
  }));

  it('Close by document click', fakeAsync(() => {
    spyOn(component, 'close').and.callFake((updateValue?: boolean) => Promise.resolve(true));
    component.open();
    fixture.detectChanges();
    tick(500);

    expect(component.close).not.toHaveBeenCalled();
    (componentRef.nativeElement as HTMLElement).parentElement!.click();
    expect(component.close).toHaveBeenCalled();
  }));

  it('Open dropdown (double call)', () => {
    expect(component.open()).toBeTrue();
    expect(component.open()).toBeFalse();
  });

  it('Open/Close (without update)', async (done) => {
    let result = await component.close();
    expect(result).toBeFalse();

    expect(component.isOpen).toBeFalse();
    component.open();
    expect(component.isOpen).toBeTrue();

    result = await component.close();
    expect(result).toBeTrue();
    done();
  });

  it('Close (with update)', async (done) => {
    hostComponent.listProvider = listProvider;
    fixture.detectChanges();

    component.open();
    fixture.detectChanges();

    activeItemService.activeItemIndex = 1;
    expect(hostComponent.selectedItem).toBeUndefined();

    const result = await component.close(true);
    expect(result).toBeTrue();

    expect(hostComponent.selectedItem).toEqual({value: 2, label: 'Two'});
    done();
  });

});
