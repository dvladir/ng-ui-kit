import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SortableComponent} from './sortable.component';
import {CdkTableModule} from '@angular/cdk/table';
import {TestScheduler} from 'rxjs/testing';
import {Component, DebugElement, NO_ERRORS_SCHEMA} from '@angular/core';
import {By} from '@angular/platform-browser';
import {Sort, Utils} from '@vt/core';
import {SortStateMockService} from '../../services/sort-state.mock.service';
import {SortStateService} from '../../services/sort-state.service';

@Component({
  selector: 'vtc-sortable-wrapper',
  template: `
    <table cdk-table [dataSource]="source">
      <ng-container cdkColumnDef="name">
        <th cdk-header-cell *cdkHeaderCellDef vtcSortable>
          Name
        </th>
        <td cdk-cell *cdkCellDef="let element">{{element.name}}</td>
      </ng-container>
      <tr cdk-header-row *cdkHeaderRowDef="cols"></tr>
      <tr crk-row *cdkRowDef="let row; columns: cols"></tr>
    </table>
  `
})
class SortableComponentWrapperComponent {
  source = [{name: 'foo'}, {name: 'bar'}, {name: 'baz'}];
  cols = ['name'];
}

describe('SortableComponent', () => {
  let host: SortableComponentWrapperComponent;
  let hostFixture: ComponentFixture<SortableComponentWrapperComponent>;
  let component: SortableComponent;
  let debugElement: DebugElement;
  let scheduler: TestScheduler;
  let mockService: SortStateMockService;

  const a = Sort.none;
  const b = Sort.desc;
  const c = Sort.asc;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CdkTableModule
      ],
      providers: [{
        provide: SortStateService,
        useClass: SortStateMockService
      }],
      declarations: [ SortableComponent, SortableComponentWrapperComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    hostFixture = TestBed.createComponent(SortableComponentWrapperComponent);
    host = hostFixture.componentInstance;
    hostFixture.detectChanges();
    debugElement = hostFixture.debugElement.query(By.directive(SortableComponent));
    component = debugElement.componentInstance;
    scheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
    mockService = TestBed.inject(SortStateService) as unknown as SortStateMockService;
  });

  it('Initial create', () => {
    expect(component).toBeTruthy();
    const sortDiv: HTMLDivElement | null = (debugElement.nativeElement as HTMLElement).querySelector<HTMLDivElement>('div.sort');

    expect(sortDiv).not.toBeNull();
    expect(sortDiv!.classList.contains('sort-asc')).toBeFalse();
    expect(sortDiv!.classList.contains('sort-desc')).toBeFalse();

    scheduler.run(({expectObservable}) => {
      expectObservable(component.sort$).toBe('a', {a: Sort.none});
    });
  });

  it('Test stream changes', () => {
    const gen = Utils.itemsIterator(b, c, null);
    scheduler.run(({expectObservable, cold}) => {

      cold('-xxx').subscribe(() => {
        const item: Sort | null = gen.next().value;
        if (item === null) {
          mockService.update({field: 'foo', sort: Sort.asc});
          return;
        }
        component.changeSort(item);
      });

      expectObservable(component.sort$).toBe('acba', {a, b, c});
    });
  });

  it('Test markup changes', () => {

    const sortDiv: HTMLDivElement | null = (debugElement.nativeElement as HTMLElement).querySelector<HTMLDivElement>('div.sort');

    expect(sortDiv).not.toBeNull();
    expect(sortDiv!.classList.contains('sort-asc')).toBeFalse();
    expect(sortDiv!.classList.contains('sort-desc')).toBeFalse();

    component.changeSort(Sort.asc);
    hostFixture.detectChanges();

    expect(sortDiv!.classList.contains('sort-asc')).toBeFalse();
    expect(sortDiv!.classList.contains('sort-desc')).toBeTrue();

    component.changeSort(Sort.desc);
    hostFixture.detectChanges();

    expect(sortDiv!.classList.contains('sort-asc')).toBeTrue();
    expect(sortDiv!.classList.contains('sort-desc')).toBeFalse();

    mockService.update({field: 'foo', sort: Sort.desc});
    hostFixture.detectChanges();
    expect(sortDiv!.classList.contains('sort-asc')).toBeFalse();
    expect(sortDiv!.classList.contains('sort-desc')).toBeFalse();
  });

});
