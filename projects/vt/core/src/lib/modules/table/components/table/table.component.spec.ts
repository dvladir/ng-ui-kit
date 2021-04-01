import {ComponentFixture, TestBed} from '@angular/core/testing';

import { TableComponent } from './table.component';
import {Component, DebugElement, NO_ERRORS_SCHEMA} from '@angular/core';
import {
  IndicatorFactoryService,
  LocalPaginationConfig,
  MockIndicatorFactoryService,
  SortableComponent
} from '@vt/core';
import {By} from '@angular/platform-browser';
import {of} from 'rxjs';
import {CdkExportModule} from '../../../cdk-export/cdk-export.module';

interface TestItem {
  name: string;
  age: number;
}

const ITEMS_1: TestItem[] = [
  {name: 'John', age: 10},
  {name: 'Alfred', age: 11},
  {name: 'Toby', age: 12},
  {name: 'James', age: 13},
  {name: 'Victor', age: 14},
  {name: 'Vincent', age: 18},
  {name: 'Valery', age: 21},
  {name: 'Ben', age: 22},
  {name: 'Belle', age: 43},
  {name: 'Ann', age: 38},
  {name: 'Goro', age: 101},
  {name: 'Shiva', age: 99},
  {name: 'Motaro', age: 98}
];

const ITEMS_2: TestItem[] = [
  {name: 'Vitaliy', age: 30},
  {name: 'Valeriy', age: 33},
  {name: 'Sergey', age: 34},
  {name: 'Alexander', age: 35},
  {name: 'Dmitriy', age: 32},
  {name: 'Vladimir', age: 34},
];

const TEST_ITEM_SORT_PREDICATES = {
  name: (a: TestItem, b: TestItem) => (a?.name || '').localeCompare(b?.name || ''),
  age: (a: TestItem, b: TestItem) => (a?.age || 0) - (b?.age || 0)
};

@Component({
  selector: 'vtc-test-host-table',
  template: `
    <vtc-table [config]="config" [pageSize]="pageSize" [dataColumns]="displayColumns">
      <ng-container cdkColumnDef="name">
        <th cdk-header-cell *cdkHeaderCellDef vtcSortable>
          Name
        </th>
        <td cdk-cell *cdkCellDef="let element">{{element.name}}</td>
      </ng-container>
      <ng-container cdkColumnDef="age">
        <th cdk-header-cell *cdkHeaderCellDef vtcSortable>
            Age
        </th>
        <td cdk-cell *cdkCellDef="let element">{{element.age}}</td>
      </ng-container>
    </vtc-table>
  `
})
class TestHostTableComponent {
  config?: LocalPaginationConfig<TestItem>;
  pageSize: number = 10;
  displayColumns?: string[];
}

describe('TableComponent', () => {
  let hostComponent: TestHostTableComponent;
  let fixture: ComponentFixture<TestHostTableComponent>;
  let component: TableComponent<TestItem>;
  let componentRef: DebugElement;

  const getTable = () => {
    const rows = componentRef.queryAll(By.css('tbody > tr'));
    const result = rows.map(row => row.queryAll(By.css('td,th')).map(cell => cell.nativeElement.innerText));
    return result;
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CdkExportModule
      ],
      declarations: [
        TableComponent,
        SortableComponent,
        TestHostTableComponent
      ],
      providers: [
        {
          provide: IndicatorFactoryService,
          useClass: MockIndicatorFactoryService
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostTableComponent);
    hostComponent = fixture.componentInstance;
    componentRef = fixture.debugElement.query(By.directive(TableComponent));
    component = componentRef.componentInstance;
    hostComponent.config = {
      source$: of(ITEMS_1),
      sortPredicates: TEST_ITEM_SORT_PREDICATES
    };
    fixture.detectChanges();
  });

  it('Items change', async () => {
    fixture.autoDetectChanges();
    await fixture.whenRenderingDone();
    let table = getTable();
    let expectedTable = ITEMS_1.slice(0, 10).map(x => [x.name, x.age.toString()]);
    expect(table).toEqual(expectedTable);
    hostComponent.config = {
      source$: of(ITEMS_2),
      sortPredicates: TEST_ITEM_SORT_PREDICATES
    };
    fixture.autoDetectChanges();
    await fixture.whenRenderingDone();
    table = getTable();
    expectedTable = ITEMS_2.slice(0, 10).map(x => [x.name, x.age.toString()]);
    expect(table).toEqual(expectedTable);
  });

  it('Page update', async  () => {
    fixture.autoDetectChanges();
    await fixture.whenRenderingDone();

    let table = getTable();
    let expectedTable = ITEMS_1.slice(0, 10).map(x => [x.name, x.age.toString()]);
    expect(table).toEqual(expectedTable);

    component.updateCurrentPage(1);
    fixture.autoDetectChanges();
    await fixture.whenRenderingDone();

    table = getTable();
    expectedTable = ITEMS_1.slice(10).map(x => [x.name, x.age.toString()]);
    expect(table).toEqual(expectedTable);

    component.updateCurrentPage(1);
    fixture.autoDetectChanges();
    await fixture.whenRenderingDone();
    table = getTable();
    expect(table).toEqual(expectedTable);
  });

  it('Page size change', async () => {
    fixture.autoDetectChanges();
    await fixture.whenRenderingDone();

    let table = getTable();
    let expectedTable = ITEMS_1.slice(0, 10).map(x => [x.name, x.age.toString()]);
    expect(table).toEqual(expectedTable);

    hostComponent.pageSize = 5;
    fixture.autoDetectChanges();
    await fixture.whenRenderingDone();

    table = getTable();
    expectedTable = ITEMS_1.slice(0, 5).map(x => [x.name, x.age.toString()]);
    expect(table).toEqual(expectedTable);
  });

  it('Display columns', async () => {

    fixture.autoDetectChanges();
    await fixture.whenRenderingDone();

    let table = getTable();
    let expectedTable = ITEMS_1.slice(0, 10).map(x => [x.name, x.age.toString()]);
    expect(table).toEqual(expectedTable);

    hostComponent.displayColumns = ['name'];
    fixture.autoDetectChanges();
    await fixture.whenRenderingDone();

    table = getTable();
    expectedTable = ITEMS_1.slice(0, 10).map(x => [x.name]);
    expect(table).toEqual(expectedTable);

    hostComponent.displayColumns = ['age'];
    fixture.autoDetectChanges();
    await fixture.whenRenderingDone();

    table = getTable();
    expectedTable = ITEMS_1.slice(0, 10).map(x => [x.age.toString()]);
    expect(table).toEqual(expectedTable);
  });

});
